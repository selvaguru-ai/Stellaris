import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: string[];
  image?: string;
}

interface OrderCartProps {
  items?: OrderItem[];
  onCheckout?: () => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
}

const OrderCart = ({
  items = [
    {
      id: "1",
      name: "Margherita Pizza",
      price: 12.99,
      quantity: 1,
      customizations: ["No Basil", "Extra Cheese"],
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&q=80",
    },
    {
      id: "2",
      name: "Caesar Salad",
      price: 8.99,
      quantity: 2,
      customizations: ["No Croutons"],
      image:
        "https://images.unsplash.com/photo-1512852939750-1305098529bf?w=300&q=80",
    },
    {
      id: "3",
      name: "Garlic Bread",
      price: 4.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1619535860434-cf9b2bca5ce0?w=300&q=80",
    },
  ],
  onCheckout = () => {},
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
}: OrderCartProps) => {
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    onRemoveItem(id);
  };

  const handleItemClick = (item: OrderItem) => {
    setSelectedItem(item);
    setIsCustomizationOpen(true);
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg border-0 h-full flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex justify-between items-center">
          <span>Your Order</span>
          <Badge variant="secondary" className="text-sm">
            {items.reduce((sum, item) => sum + item.quantity, 0)} items
          </Badge>
        </CardTitle>
      </CardHeader>

      {items.length > 0 ? (
        <>
          <ScrollArea className="flex-grow">
            <CardContent className="p-4">
              {items.map((item) => (
                <div key={item.id} className="mb-4">
                  <div className="flex items-start gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <span>${item.price.toFixed(2)} each</span>
                      </div>
                      {item.customizations &&
                        item.customizations.length > 0 && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {item.customizations.join(", ")}
                          </div>
                        )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-2">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground"
                            onClick={() => handleItemClick(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </CardContent>
          </ScrollArea>

          <CardFooter className="flex-col p-4 pt-0 gap-4 border-t">
            <div className="w-full">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2 font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={onCheckout}>
              Proceed to Checkout <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardContent className="flex flex-col items-center justify-center h-64 p-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Your cart is empty</p>
            <Button variant="outline">Browse Menu</Button>
          </div>
        </CardContent>
      )}

      <Dialog open={isCustomizationOpen} onOpenChange={setIsCustomizationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <h3 className="font-medium text-lg">{selectedItem.name}</h3>
              <p className="text-muted-foreground mb-4">
                ${selectedItem.price.toFixed(2)}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Customizations</h4>
                  {selectedItem.customizations &&
                  selectedItem.customizations.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedItem.customizations.map(
                        (customization, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span>{customization}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No customizations added
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Add Special Instructions</h4>
                  <textarea
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Add any special instructions here..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCustomizationOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsCustomizationOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OrderCart;
