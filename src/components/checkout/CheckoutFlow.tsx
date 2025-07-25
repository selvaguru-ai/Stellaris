import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Wallet,
  Percent,
  Users,
  Receipt,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

interface CheckoutFlowProps {
  orderItems?: OrderItem[];
  onComplete?: (orderData: OrderData) => void;
  onCancel?: () => void;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: string[];
}

interface OrderData {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod: string;
  splitDetails?: SplitDetail[];
}

interface SplitDetail {
  name: string;
  amount: number;
  paid: boolean;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  orderItems = [
    { id: "1", name: "Margherita Pizza", price: 12.99, quantity: 1 },
    {
      id: "2",
      name: "Caesar Salad",
      price: 8.99,
      quantity: 1,
      customizations: ["No croutons"],
    },
    { id: "3", name: "Garlic Bread", price: 4.99, quantity: 2 },
  ],
  onComplete = () => {},
  onCancel = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState("");
  const [splitBill, setSplitBill] = useState(false);
  const [splitDetails, setSplitDetails] = useState<SplitDetail[]>([]);
  const [orderStatus, setOrderStatus] = useState("");

  // Calculate order totals
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08; // Assuming 8% tax rate
  const tipAmount = customTip
    ? parseFloat(customTip)
    : subtotal * (tipPercentage / 100);
  const total = subtotal + tax + tipAmount;

  const steps = [
    { title: "Review Order", icon: Receipt },
    { title: "Payment Method", icon: CreditCard },
    { title: "Add Tip", icon: Percent },
    { title: "Split Bill", icon: Users },
    { title: "Confirmation", icon: Check },
  ];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // Complete checkout
      const orderData: OrderData = {
        items: orderItems,
        subtotal,
        tax,
        tip: tipAmount,
        total,
        paymentMethod,
        splitDetails: splitBill ? splitDetails : undefined,
      };

      // Simulate order processing
      setOrderStatus("processing");
      setTimeout(() => {
        setOrderStatus("complete");
        onComplete(orderData);
      }, 2000);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const handleSplitBillToggle = (value: boolean) => {
    setSplitBill(value);
    if (value && splitDetails.length === 0) {
      // Initialize with 2 people by default
      setSplitDetails([
        { name: "Person 1", amount: total / 2, paid: false },
        { name: "Person 2", amount: total / 2, paid: false },
      ]);
    }
  };

  const handleAddPerson = () => {
    const personCount = splitDetails.length + 1;
    const equalAmount = total / personCount;

    // Update existing splits
    const updatedSplits = splitDetails.map((split) => ({
      ...split,
      amount: equalAmount,
    }));

    // Add new person
    setSplitDetails([
      ...updatedSplits,
      { name: `Person ${personCount}`, amount: equalAmount, paid: false },
    ]);
  };

  const handleRemovePerson = (index: number) => {
    if (splitDetails.length <= 2) return; // Minimum 2 people for split

    const newSplits = splitDetails.filter((_, i) => i !== index);
    const equalAmount = total / newSplits.length;

    // Redistribute amounts
    setSplitDetails(
      newSplits.map((split) => ({
        ...split,
        amount: equalAmount,
      })),
    );
  };

  const handleSplitAmountChange = (index: number, amount: number) => {
    const newSplits = [...splitDetails];
    newSplits[index].amount = amount;
    setSplitDetails(newSplits);
  };

  const handlePersonNameChange = (index: number, name: string) => {
    const newSplits = [...splitDetails];
    newSplits[index].name = name;
    setSplitDetails(newSplits);
  };

  const handleTogglePaid = (index: number) => {
    const newSplits = [...splitDetails];
    newSplits[index].paid = !newSplits[index].paid;
    setSplitDetails(newSplits);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Review Order
        return (
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {orderItems.map((item) => (
                <Card key={item.id} className="bg-background">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity > 1 && <span>x{item.quantity} </span>}
                          {item.customizations?.map((custom, i) => (
                            <Badge key={i} variant="outline" className="mr-1">
                              {custom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${(subtotal + tax).toFixed(2)}</span>
              </div>
            </div>
          </div>
        );

      case 1: // Payment Method
        return (
          <div className="space-y-6">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent cursor-pointer">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    <span>Credit / Debit Card</span>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent cursor-pointer">
                <RadioGroupItem value="digital-wallet" id="digital-wallet" />
                <Label
                  htmlFor="digital-wallet"
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-5 w-5" />
                    <span>Digital Wallet</span>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent cursor-pointer">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.384a.641.641 0 0 1 .632-.544h6.964c2.387 0 4.14.745 5.178 2.227.476.704.8 1.527.93 2.367.134.851.057 1.8-.237 2.873v.001l-.001.001-.001.002c-.02.075-.04.15-.062.226-.958 3.461-4.241 4.686-7.707 4.686h-1.946c-.75 0-1.39.543-1.51 1.286l-.814 5.15a.642.642 0 0 1-.633.544h-1.06z" />
                      <path d="M19.076 8.1v.001c.322 2.075-.033 3.48-.365 4.381-1.175 3.214-4.076 4.343-7.384 4.343h-1.9c-.083 0-.154.06-.167.144l-1.013 6.412c-.013.083-.083.144-.167.144h-3.55a.168.168 0 0 1-.167-.194l2.31-14.592a.168.168 0 0 1 .167-.144h7.154c1.764 0 3.196.446 4.082 1.504z" />
                    </svg>
                    <span>PayPal</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "credit-card" && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name on Card</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Add Tip
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium">
                Would you like to add a tip?
              </p>
              <p className="text-sm text-muted-foreground">
                Show your appreciation for great service
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[10, 15, 20].map((percent) => (
                <Button
                  key={percent}
                  variant={tipPercentage === percent ? "default" : "outline"}
                  className="h-16 text-lg"
                  onClick={() => {
                    setTipPercentage(percent);
                    setCustomTip("");
                  }}
                >
                  {percent}%
                  <span className="block text-xs mt-1">
                    ${(subtotal * (percent / 100)).toFixed(2)}
                  </span>
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-tip">Custom Amount</Label>
              <Input
                id="custom-tip"
                placeholder="Enter custom tip amount"
                value={customTip}
                onChange={(e) => {
                  setCustomTip(e.target.value);
                  setTipPercentage(0);
                }}
                type="number"
                min="0"
                step="0.01"
              />
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip</span>
                <span>${tipAmount.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );

      case 3: // Split Bill
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium">
                Would you like to split the bill?
              </p>
              <p className="text-sm text-muted-foreground">
                Easily divide the total among friends
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant={splitBill ? "default" : "outline"}
                onClick={() => handleSplitBillToggle(true)}
              >
                Yes, split the bill
              </Button>
              <Button
                variant={!splitBill ? "default" : "outline"}
                onClick={() => handleSplitBillToggle(false)}
              >
                No, pay in full
              </Button>
            </div>

            {splitBill && (
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Split Details</h3>
                  <Button variant="outline" size="sm" onClick={handleAddPerson}>
                    Add Person
                  </Button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {splitDetails.map((split, index) => (
                    <Card key={index} className="bg-background">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              value={split.name}
                              onChange={(e) =>
                                handlePersonNameChange(index, e.target.value)
                              }
                              className="mb-2"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-sm">$</span>
                              <Input
                                type="number"
                                value={split.amount.toFixed(2)}
                                onChange={(e) =>
                                  handleSplitAmountChange(
                                    index,
                                    parseFloat(e.target.value),
                                  )
                                }
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <Button
                              variant={split.paid ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleTogglePaid(index)}
                            >
                              {split.paid ? "Paid" : "Mark Paid"}
                            </Button>
                            {splitDetails.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePerson(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Split Amount (per person)</span>
                    <span>${(total / splitDetails.length).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4: // Confirmation
        return (
          <div className="space-y-6 text-center">
            {orderStatus === "processing" ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <p className="text-lg font-medium">Processing your order...</p>
                <Progress value={65} className="w-full" />
              </div>
            ) : orderStatus === "complete" ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Order Confirmed!</h3>
                  <p className="text-muted-foreground">
                    Your order has been placed successfully
                  </p>
                </div>
                <div className="pt-4 space-y-2 text-left max-w-xs mx-auto">
                  <div className="flex justify-between">
                    <span>Order Number</span>
                    <span className="font-medium">#12345</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Time</span>
                    <span className="font-medium">25-30 minutes</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg font-medium">Review your order details</p>
                <div className="pt-4 space-y-2 text-left max-w-xs mx-auto">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <span>Payment Method</span>
                    <span className="font-medium">
                      {paymentMethod === "credit-card"
                        ? "Credit Card"
                        : paymentMethod === "digital-wallet"
                          ? "Digital Wallet"
                          : "PayPal"}
                    </span>
                  </div>
                  {splitBill && (
                    <div className="flex justify-between">
                      <span>Split Between</span>
                      <span className="font-medium">
                        {splitDetails.length} people
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-background">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>
          Complete your order in a few simple steps
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${index > currentStep ? "text-muted-foreground" : ""}`}
                style={{ width: `${100 / steps.length}%` }}
              >
                <div
                  className={`rounded-full p-2 ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : index < currentStep
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 text-center">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-muted rounded-full">
            <div
              className="absolute h-1 bg-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={orderStatus === "processing"}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {currentStep === 0 ? "Cancel" : "Back"}
        </Button>

        <Button onClick={handleNext} disabled={orderStatus === "processing"}>
          {currentStep === steps.length - 1 ? (
            orderStatus === "complete" ? (
              "Done"
            ) : (
              "Place Order"
            )
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CheckoutFlow;
