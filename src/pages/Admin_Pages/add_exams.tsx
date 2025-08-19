import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronLeft, Check, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { MathfieldElement } from "mathlive";
import TopicInSubjectService from "@/services/Admin_Service/Topic_InSubject_service";
import ExamService from "@/services/Admin_Service/exams_services";

interface Topic {
    _id: string;
    title: string;
    description: string;
    subjectName: string;
    subject: {
        _id: string;
        subjectName: string;
        imageUrl: string;
        Level: string;
        showSubject: boolean;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    showTopic: boolean;
    price: number;
    regularPrice: number;
    subscriptionPeriod: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Question {
    questionText: string;
    options: string[];
    correctAnswer: string;
    correctAnswerExplanation: string;
}

interface ExamFormData {
    subject: string;
    Topic: string;
    level: string;
    title: string;
    durationInMinutes: number;
    questions: Question[];
    isPublished: boolean;
}

const extractLatexFromText = (text: string): string => {
    if (!text) return "";
    if (text.startsWith("\\(") && text.endsWith("\\)")) {
        return text.substring(2, text.length - 2);
    }
    return text;
};

interface MathInputProps {
    value: string;
    onChange: (value: string) => void;
    onSave?: () => void;
    onCancel?: () => void;
    editing: boolean;
    placeholder?: string;
    className?: string;
}

const MathInput: React.FC<MathInputProps> = ({
    value,
    onChange,
    onSave,
    onCancel,
    editing,
    placeholder = "",
    className = "",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mathfieldRef = useRef<MathfieldElement | null>(null);
    const ignoreNextChange = useRef(false);

    useEffect(() => {
        if (!containerRef.current) return;

        if (!mathfieldRef.current) {
            const mf = new MathfieldElement();
            mathfieldRef.current = mf;

            mf.setOptions({
                defaultMode: "math",
                smartMode: true,
                virtualKeyboardMode: "onfocus",
                virtualKeyboards: "all",
                inlineShortcuts: {
                    "++": "\\plus",
                    "->": "\\rightarrow",
                },
                readOnly: !editing,
            });

            mf.style.width = "100%";
            mf.style.minHeight = !editing ? "auto" : "60px";
            mf.style.padding = !editing ? "0" : "8px";
            mf.style.border = !editing ? "none" : "1px solid #d1d5db";
            mf.style.borderRadius = "6px";
            mf.style.backgroundColor = !editing ? "transparent" : "#fff";

            if (!editing) {
                mf.style.pointerEvents = "none";
                mf.style.cursor = "default";
            }

            mf.addEventListener("input", (evt) => {
                if (!editing) return;
                ignoreNextChange.current = true;
                onChange(`\\(${(evt.target as MathfieldElement).value}\\)`);
            });

            containerRef.current.appendChild(mf);
        }

        const unwrappedValue = extractLatexFromText(value || "");
        if (mathfieldRef.current.value !== unwrappedValue) {
            mathfieldRef.current.value = unwrappedValue;
        }

        mathfieldRef.current.setOptions({ readOnly: !editing });
        mathfieldRef.current.style.pointerEvents = editing ? "auto" : "none";
        mathfieldRef.current.style.backgroundColor = editing ? "#fff" : "transparent";
        mathfieldRef.current.style.minHeight = editing ? "60px" : "auto";
        mathfieldRef.current.style.padding = editing ? "8px" : "0";
        mathfieldRef.current.style.border = editing ? "1px solid #d1d5db" : "none";

        return () => {
            if (mathfieldRef.current) {
                mathfieldRef.current.remove();
                mathfieldRef.current = null;
            }
        };
    }, [editing]);

    useEffect(() => {
        if (!mathfieldRef.current || ignoreNextChange.current) {
            ignoreNextChange.current = false;
            return;
        }

        const unwrappedValue = extractLatexFromText(value || "");
        if (mathfieldRef.current.value !== unwrappedValue) {
            mathfieldRef.current.value = unwrappedValue;
        }
    }, [value]);

    return (
        <div className={`relative ${className}`}>
            <div ref={containerRef} />
            {editing && (
                <div className="flex justify-end gap-2 mt-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={onCancel}
                        className="h-8 px-3"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={onSave}
                        className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white"
                    >
                        <Check size={14} className="mr-1" />
                        Save
                    </Button>
                </div>
            )}
            {!value && !editing && (
                <div className="text-gray-400 italic text-sm">{placeholder}</div>
            )}
        </div>
    );
};

const CreateExam: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [topics, setTopics] = useState<Topic[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    const [examData, setExamData] = useState<ExamFormData>({
        subject: "",
        Topic: topicId || "",
        level: "",
        title: "",
        durationInMinutes: 60,
        questions: [
            {
                questionText: "",
                options: [""],
                correctAnswer: "",
                correctAnswerExplanation: "",
            },
        ],
        isPublished: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingStates, setEditingStates] = useState<{
        [key: string]: boolean;
    }>({});

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setLoadingTopics(true);
                const response = await TopicInSubjectService.getAllTopics();
                setTopics(response.data);

                if (topicId) {
                    const topic = response.data.find(t => t._id === topicId);
                    if (topic) {
                        setSelectedTopic(topic);
                        setExamData(prev => ({
                            ...prev,
                            Topic: topic._id,
                            subject: topic.subject._id,
                            level: topic.subject.Level
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch topics:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch topics. Please try again.",
                });
            } finally {
                setLoadingTopics(false);
            }
        };

        fetchTopics();
    }, [topicId, toast]);

    const toggleEditing = (fieldPath: string) => {
        setEditingStates((prev) => ({
            ...prev,
            [fieldPath]: !prev[fieldPath],
        }));
    };

    const saveMathValue = (fieldPath: string) => {
        setEditingStates((prev) => ({
            ...prev,
            [fieldPath]: false,
        }));
    };

    const cancelEditing = (fieldPath: string) => {
        setEditingStates((prev) => ({
            ...prev,
            [fieldPath]: false,
        }));
    };

    const getFieldPath = (
        questionIndex: number,
        optionIndex: number | null,
        fieldName: string
    ) => {
        if (optionIndex === null) {
            return `question_${questionIndex}_${fieldName}`;
        }
        return `question_${questionIndex}_option_${optionIndex}_${fieldName}`;
    };

    const handleTopicChange = (topicId: string) => {
        const topic = topics.find(t => t._id === topicId);
        if (topic) {
            setSelectedTopic(topic);
            setExamData(prev => ({
                ...prev,
                Topic: topic._id,
                subject: topic.subject._id,
                level: topic.subject.Level
            }));
        }
    };

    const addQuestion = () => {
        setExamData((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    questionText: "",
                    options: [""],
                    correctAnswer: "",
                    correctAnswerExplanation: "",
                },
            ],
        }));
    };

    const removeQuestion = (index: number) => {
        if (examData.questions.length > 1) {
            setExamData((prev) => ({
                ...prev,
                questions: prev.questions.filter((_, i) => i !== index),
            }));
        }
    };

    const addOption = (questionIndex: number) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options: [...updatedQuestions[questionIndex].options, ""],
        };
        setExamData({
            ...examData,
            questions: updatedQuestions,
        });
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        if (examData.questions[questionIndex].options.length > 1) {
            const updatedQuestions = [...examData.questions];
            const updatedOptions = [
                ...updatedQuestions[questionIndex].options,
            ].filter((_, i) => i !== optionIndex);

            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                options: updatedOptions,
            };

            setExamData({
                ...examData,
                questions: updatedQuestions,
            });
        }
    };

    const updateQuestionField = (
        questionIndex: number,
        field: keyof Question,
        value: string
    ) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            [field]: value,
        };
        setExamData({
            ...examData,
            questions: updatedQuestions,
        });
    };

    const updateOption = (
        questionIndex: number,
        optionIndex: number,
        value: string
    ) => {
        const updatedQuestions = [...examData.questions];
        const updatedOptions = [...updatedQuestions[questionIndex].options];
        updatedOptions[optionIndex] = value;
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options: updatedOptions,
        };
        setExamData({
            ...examData,
            questions: updatedQuestions,
        });
    };

    const handleCreateExam = async () => {
        try {
            setIsSubmitting(true);

            if (!examData.subject.trim()) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Subject is required",
                });
                return;
            }

            if (!examData.Topic.trim()) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Topic is required",
                });
                return;
            }

            if (!examData.title.trim()) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Title is required",
                });
                return;
            }

            if (examData.durationInMinutes <= 0) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Duration must be greater than 0",
                });
                return;
            }

            const questionErrors: number[] = [];
            examData.questions.forEach((question, index) => {
                if (!question.questionText.trim()) {
                    questionErrors.push(index + 1);
                }

                if (!question.correctAnswer.trim()) {
                    toast({
                        variant: "destructive",
                        title: "Validation Error",
                        description: `Correct answer is required for question ${index + 1}`,
                    });
                    return;
                }

                if (!question.options.includes(question.correctAnswer)) {
                    toast({
                        variant: "destructive",
                        title: "Validation Error",
                        description: `Correct answer must be one of the options for question ${index + 1}`,
                    });
                    return;
                }
            });

            if (questionErrors.length > 0) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: `Question text is required for questions: ${questionErrors.join(", ")}`,
                });
                return;
            }

            const optionErrors: { question: number; option: number }[] = [];
            examData.questions.forEach((question, questionIndex) => {
                question.options.forEach((option, optionIndex) => {
                    if (!option.trim()) {
                        optionErrors.push({
                            question: questionIndex + 1,
                            option: optionIndex + 1,
                        });
                    }
                });
            });

            if (optionErrors.length > 0) {
                const errorList = optionErrors
                    .map(
                        (err) => `Question ${err.question} Option ${err.option}`
                    )
                    .join(", ");
                const t = toast({
                    variant: "destructive",
                    title: "Oops! Missing Option Text",
                    description: `Please provide option text for the following: ${errorList}`,
                    duration: 8000,
                    action: (
                        <Button
                            variant="secondary"
                            className="bg-white text-red-600 hover:bg-red-100"
                            onClick={() => t.dismiss()} // dismiss the toast safely
                        >
                            Dismiss
                        </Button>
                    ),
                });

                return;
            }

            const response = await ExamService.createExam(examData);
            console.log("Exam created successfully:", response.message);
            if (response.message === "Exam created successfully") {
                const t = toast({
                    title: "🎉 Exam Created Successfully",
                    description: "Your exam has been created and is ready to use.",
                    variant: "default",
                    duration: 8000,
                    action: (
                        <Button
                            variant="secondary"
                            className="bg-green-600 text-white hover:bg-green-700"
                            onClick={() => t.dismiss()} // dismiss the toast safely
                        >
                            Got it
                        </Button>
                    ),
                });

                navigate(-1);
            } else {
                throw new Error(`Unexpected status: ${response.status}`);
            }

        } catch (error) {
            console.error("Failed to create exam:", error);
            const t = toast({
                variant: "destructive",
                title: "Oops! Something went wrong",
                description: "We couldn’t create your exam right now. Please try again.",
                duration: 8000,
                action: (
                    <Button
                        variant="secondary"
                        className="bg-white text-red-600 hover:bg-red-100"
                        onClick={() => t.dismiss()} // dismiss the toast safely
                    >
                        Dismiss
                    </Button>
                ),
            });

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <div className="w-full px-0 py-0">
                <div className="relative p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="text-white hover:bg-white/20"
                        >
                            <ChevronLeft size={20} className="mr-2" />
                            Back
                        </Button>
                        <div className="text-center flex-1">
                            <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Plus size={24} className="text-white" />
                                </div>
                                Create New Exam
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Topic
                                </label>
                                {loadingTopics ? (
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
                                ) : (
                                    <select
                                        value={examData.Topic}
                                        onChange={(e) => handleTopicChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select a topic</option>
                                        {topics.map((topic) => (
                                            <option key={topic._id} value={topic._id}>
                                                {topic.title}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {selectedTopic && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Subject
                                        </label>
                                        <Input
                                            value={selectedTopic.subject.subjectName}
                                            readOnly
                                            className="w-full bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Level
                                        </label>
                                        <Input
                                            value={selectedTopic.subject.Level}
                                            readOnly
                                            className="w-full bg-gray-100"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Exam Title
                                </label>
                                <Input
                                    value={examData.title}
                                    onChange={(e) =>
                                        setExamData({ ...examData, title: e.target.value })
                                    }
                                    placeholder="Enter exam title"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (minutes)
                                </label>
                                <Input
                                    type="number"
                                    value={examData.durationInMinutes}
                                    onChange={(e) =>
                                        setExamData({
                                            ...examData,
                                            durationInMinutes: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
                            <Button
                                onClick={addQuestion}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            >
                                <Plus size={16} className="mr-1" />
                                Add Question
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {examData.questions.map((question, questionIndex) => (
                                <div
                                    key={questionIndex}
                                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {questionIndex + 1}
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-800">
                                                Question {questionIndex + 1}
                                            </h3>
                                        </div>
                                        {examData.questions.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-400 hover:text-red-500"
                                                onClick={() => removeQuestion(questionIndex)}
                                            >
                                                <X size={18} />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Question Text
                                        </label>
                                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                            {editingStates[
                                                getFieldPath(questionIndex, null, "questionText")
                                            ] ? (
                                                <MathInput
                                                    value={question.questionText}
                                                    onChange={(value) =>
                                                        updateQuestionField(
                                                            questionIndex,
                                                            "questionText",
                                                            value
                                                        )
                                                    }
                                                    editing={true}
                                                    onSave={() =>
                                                        saveMathValue(
                                                            getFieldPath(questionIndex, null, "questionText")
                                                        )
                                                    }
                                                    onCancel={() =>
                                                        cancelEditing(
                                                            getFieldPath(questionIndex, null, "questionText")
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <MathInput
                                                            value={question.questionText}
                                                            editing={false}
                                                            placeholder="Click edit to add question"
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-400 hover:text-blue-500"
                                                        onClick={() =>
                                                            toggleEditing(
                                                                getFieldPath(
                                                                    questionIndex,
                                                                    null,
                                                                    "questionText"
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Options
                                            </label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addOption(questionIndex)}
                                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                            >
                                                <Plus size={14} className="mr-1" />
                                                Add Option
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {question.options.map((option, optionIndex) => (
                                                <div
                                                    key={optionIndex}
                                                    className="flex items-start gap-3"
                                                >
                                                    <div className="flex items-center h-5 mt-1.5">
                                                        <input
                                                            type="radio"
                                                            name={`correct-answer-${questionIndex}`}
                                                            checked={
                                                                question.correctAnswer === option
                                                            }
                                                            onChange={() =>
                                                                updateQuestionField(
                                                                    questionIndex,
                                                                    "correctAnswer",
                                                                    option
                                                                )
                                                            }
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 border border-gray-200 rounded-lg p-3 bg-gray-50">
                                                        {editingStates[
                                                            getFieldPath(
                                                                questionIndex,
                                                                optionIndex,
                                                                "option"
                                                            )
                                                        ] ? (
                                                            <MathInput
                                                                value={option}
                                                                onChange={(value) =>
                                                                    updateOption(
                                                                        questionIndex,
                                                                        optionIndex,
                                                                        value
                                                                    )
                                                                }
                                                                editing={true}
                                                                onSave={() =>
                                                                    saveMathValue(
                                                                        getFieldPath(
                                                                            questionIndex,
                                                                            optionIndex,
                                                                            "option"
                                                                        )
                                                                    )
                                                                }
                                                                onCancel={() =>
                                                                    cancelEditing(
                                                                        getFieldPath(
                                                                            questionIndex,
                                                                            optionIndex,
                                                                            "option"
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <MathInput
                                                                        value={option}
                                                                        editing={false}
                                                                        placeholder="Click edit to add option"
                                                                    />
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-gray-400 hover:text-blue-500"
                                                                        onClick={() =>
                                                                            toggleEditing(
                                                                                getFieldPath(
                                                                                    questionIndex,
                                                                                    optionIndex,
                                                                                    "option"
                                                                                )
                                                                            )
                                                                        }
                                                                    >
                                                                        <Edit size={16} />
                                                                    </Button>
                                                                    {question.options.length > 1 && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="text-gray-400 hover:text-red-500"
                                                                            onClick={() =>
                                                                                removeOption(
                                                                                    questionIndex,
                                                                                    optionIndex
                                                                                )
                                                                            }
                                                                        >
                                                                            <X size={16} />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Correct Answer
                                        </label>
                                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                            {editingStates[
                                                getFieldPath(questionIndex, null, "correctAnswer")
                                            ] ? (
                                                <MathInput
                                                    value={question.correctAnswer}
                                                    onChange={(value) =>
                                                        updateQuestionField(
                                                            questionIndex,
                                                            "correctAnswer",
                                                            value
                                                        )
                                                    }
                                                    editing={true}
                                                    onSave={() =>
                                                        saveMathValue(
                                                            getFieldPath(
                                                                questionIndex,
                                                                null,
                                                                "correctAnswer"
                                                            )
                                                        )
                                                    }
                                                    onCancel={() =>
                                                        cancelEditing(
                                                            getFieldPath(
                                                                questionIndex,
                                                                null,
                                                                "correctAnswer"
                                                            )
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <MathInput
                                                            value={question.correctAnswer}
                                                            editing={false}
                                                            placeholder="Click edit to set correct answer"
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-400 hover:text-blue-500"
                                                        onClick={() =>
                                                            toggleEditing(
                                                                getFieldPath(
                                                                    questionIndex,
                                                                    null,
                                                                    "correctAnswer"
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Correct Answer Explanation
                                        </label>
                                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                            {editingStates[
                                                getFieldPath(questionIndex, null, "correctAnswerExplanation")
                                            ] ? (
                                                <MathInput
                                                    value={question.correctAnswerExplanation}
                                                    onChange={(value) =>
                                                        updateQuestionField(
                                                            questionIndex,
                                                            "correctAnswerExplanation",
                                                            value
                                                        )
                                                    }
                                                    editing={true}
                                                    onSave={() =>
                                                        saveMathValue(
                                                            getFieldPath(
                                                                questionIndex,
                                                                null,
                                                                "correctAnswerExplanation"
                                                            )
                                                        )
                                                    }
                                                    onCancel={() =>
                                                        cancelEditing(
                                                            getFieldPath(
                                                                questionIndex,
                                                                null,
                                                                "correctAnswerExplanation"
                                                            )
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <MathInput
                                                            value={question.correctAnswerExplanation}
                                                            editing={false}
                                                            placeholder="Click edit to add explanation"
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-400 hover:text-blue-500"
                                                        onClick={() =>
                                                            toggleEditing(
                                                                getFieldPath(
                                                                    questionIndex,
                                                                    null,
                                                                    "correctAnswerExplanation"
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 px-6 py-4 bg-gray-50/80 border-t border-gray-200">
                    <div className="flex justify-between w-full items-center">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="h-12 px-6 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleCreateExam}
                            disabled={isSubmitting}
                            className="h-12 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:shadow-lg"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                                    Creating...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Plus size={16} />
                                    Create Exam
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExam;