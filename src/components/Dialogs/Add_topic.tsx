import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import TopicInSubjectService from "@/services/Admin_Service/Topic_InSubject_service";

type AddTopicDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: string;
  onTopicAdded: () => void;
};

const defaultTopicData = {
  title: "",
  description: "",
  price: 0,
  regularPrice: 0,
  subscriptionPeriod: "monthly",
  order: 0,
};

const AddTopicDialog: React.FC<AddTopicDialogProps> = ({
  open,
  onOpenChange,
  subjectId,
  onTopicAdded,
}) => {
  const [topicData, setTopicData] = useState({ ...defaultTopicData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setTopicData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTopicData((prev) => ({
      ...prev,
      [id]: value === "" ? 0 : Number(value),
    }));
  };

  const handleSubscriptionPeriodChange = (value: string) => {
    setTopicData((prev) => ({ ...prev, subscriptionPeriod: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!topicData.title.trim()) {
        throw new Error("Topic title is required");
      }

      const apiTopicData = {
        title: topicData.title.trim(),
        description: topicData.description || "",
        subject: subjectId,
        subjectName: subjectId, // to be overridden by backend
        showTopic: true,
        price: topicData.price,
        regularPrice: topicData.regularPrice,
        subscriptionPeriod: topicData.subscriptionPeriod,
        order: Number(topicData.order) || 0,
      };

      await TopicInSubjectService.createTopic(apiTopicData);

      toast({
        title: "Topic created",
        description: "The topic has been added to this subject.",
      });

      setTopicData({ ...defaultTopicData });
      onOpenChange(false);
      onTopicAdded();
    } catch (error: any) {
      console.error("Failed to create topic:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create topic. Please try again.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] mx-4 max-w-full">
      <DialogHeader>
        <DialogTitle>Add New Topic</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Topic Title</Label>
          <Input
            id="title"
            value={topicData.title}
            onChange={handleChange}
            placeholder="Enter topic title"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={topicData.description}
            onChange={handleChange}
            placeholder="Topic description..."
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={topicData.price}
              onChange={handleNumberChange}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="regularPrice">Regular Price</Label>
            <Input
              id="regularPrice"
              type="number"
              min="0"
              step="0.01"
              value={topicData.regularPrice}
              onChange={handleNumberChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="subscriptionPeriod">Subscription Period</Label>
          <Select
            onValueChange={handleSubscriptionPeriodChange}
            value={topicData.subscriptionPeriod}
          >
            <SelectTrigger id="subscriptionPeriod">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="onetime">One-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            min="0"
            value={topicData.order}
            onChange={handleNumberChange}
            placeholder="1"
          />
          <p className="text-xs text-muted-foreground">
            The order in which this topic appears in the subject
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Add Topic"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
export default AddTopicDialog;
