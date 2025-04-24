
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DollarSign, Plus, ArrowUpRight, ArrowDownLeft, Check } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  
  // Mock wallet data
  const walletData = {
    balance: 125.00,
    transactions: [
      {
        id: "t1",
        type: "deposit",
        amount: 50.00,
        date: "Apr 15, 2025",
        description: "Wallet top-up",
        status: "completed",
      },
      {
        id: "t2",
        type: "payment",
        amount: 25.00,
        date: "Apr 10, 2025",
        description: "Advanced Data Science with Python",
        status: "completed",
      },
      {
        id: "t3",
        type: "deposit",
        amount: 100.00,
        date: "Mar 28, 2025",
        description: "Wallet top-up",
        status: "completed",
      },
      {
        id: "t4",
        type: "payment",
        amount: 35.00,
        date: "Mar 20, 2025",
        description: "Introduction to Web Development",
        status: "completed",
      },
      {
        id: "t5",
        type: "refund",
        amount: 35.00,
        date: "Mar 15, 2025",
        description: "Refund: UX Design Masterclass",
        status: "completed",
      },
    ],
    paymentMethods: [
      {
        id: "p1",
        type: "visa",
        lastDigits: "4242",
        expiryDate: "05/26",
        isDefault: true,
      },
      {
        id: "p2",
        type: "mastercard",
        lastDigits: "8765",
        expiryDate: "12/25",
        isDefault: false,
      },
    ],
  };
  
  return (
    <div>
      <SectionTitle 
        title="Wallet" 
        description="Manage your balance and transactions"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">${walletData.balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Last updated: April 15, 2025</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1 gap-1">
                <Plus className="h-4 w-4" /> Add Money
              </Button>
              <Button variant="outline" className="flex-1 gap-1">
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Add Payment Method
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v6.5l3-3"></path>
                  <path d="M12 2v6.5l-3-3"></path>
                  <path d="M17 20.66C15.46 21.95 13.75 22.73 12 23c-1.75-.27-3.46-1.05-5-2.34"></path>
                  <path d="M15.3 14.3a4 4 0 0 0-5.6 0"></path>
                  <path d="M18.5 11.5a8 8 0 0 0-13 0"></path>
                  <path d="M4.34 17A10 10 0 0 1 12 12c3.58 0 6.78 1.79 8.7 4.67"></path>
                </svg>
                Purchase Credits
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <path d="M21 15l-5-5L5 21"></path>
                </svg>
                View Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions & Payment Methods */}
      <Tabs defaultValue="transactions" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="bg-white rounded-lg p-6">
          <div className="space-y-4">
            {walletData.transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-4 p-3 border-b border-border last:border-0">
                <div className={`rounded-full p-2 ${
                  transaction.type === "deposit" 
                    ? "bg-green-100 text-green-600" 
                    : transaction.type === "refund"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-red-100 text-red-600"
                }`}>
                  {transaction.type === "deposit" || transaction.type === "refund" ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium">{transaction.description}</h4>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                
                <div className="text-right">
                  <div className={`font-medium ${
                    transaction.type === "deposit" || transaction.type === "refund" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {transaction.type === "deposit" || transaction.type === "refund" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                    <Check className="h-3 w-3 text-green-500" />
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="payment-methods" className="bg-white rounded-lg p-6">
          <div className="space-y-4">
            {walletData.paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                  {method.type === "visa" ? (
                    <span className="text-blue-600 font-bold">VISA</span>
                  ) : (
                    <span className="text-orange-600 font-bold">MC</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium capitalize">{method.type}</h4>
                    {method.isDefault && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">•••• {method.lastDigits} | Expires: {method.expiryDate}</p>
                </div>
                
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            ))}
            
            <div className="mt-4">
              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add New Payment Method
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Mock Badge component that should be imported from shadcn
const Badge = ({ variant, className, children }: any) => {
  return <span className={className}>{children}</span>;
};

export default Wallet;
