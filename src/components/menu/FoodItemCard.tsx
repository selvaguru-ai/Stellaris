import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";

interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

interface FoodItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  customizationOptions?: CustomizationOption[];
  onAddToCart?: (item: any, quantity: number, customizations: string[]) => void;
}

const FoodItemCard = ({
  id = "1",
  name = "Margherita Pizza",
  description = "Classic pizza with tomato sauce, mozzarella, and fresh basil",
  price = 12.99,
  image = "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=75",
  category = "Pizza",
  tags = ["Vegetarian", "Popular"],
  customizationOptions = [
    { id: "1", name: "Extra Cheese", price: 1.5 },
    { id: "2", name: "Mushrooms", price: 1.0 },
    { id: "3", name: "Olives", price: 0.75 },
  ],
  onAddToCart = () => {},
}: FoodItemCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = React.useState<
    string[]
  >([]);

  const handleCustomizationToggle = (id: string) => {
    setSelectedCustomizations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const calculateTotalPrice = () => {
    const customizationsTotal = selectedCustomizations.reduce((total, id) => {
      const option = customizationOptions.find((opt) => opt.id === id);
      return total + (option?.price || 0);
    }, 0);

    return (price + customizationsTotal) * quantity;
  };

  const handleAddToCart = () => {
    onAddToCart(
      {
        id,
        name,
        price,
        image,
        category,
      },
      quantity,
      selectedCustomizations,
    );
    setIsDialogOpen(false);
    setQuantity(1);
    setSelectedCustomizations([]);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {tags && tags.length > 0 && (
            <div className="absolute top-2 left-2 flex gap-1">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/80 backdrop-blur-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <CardContent className="flex-grow pt-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
          <p className="text-primary font-medium mt-2">${price.toFixed(2)}</p>
        </CardContent>

        <CardFooter className="pt-0">
          <Button onClick={() => setIsDialogOpen(true)} className="w-full">
            Customize & Add
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <img
                src={image}
                alt={name}
                className="w-full max-h-48 object-cover rounded-md"
              />
            </div>

            {customizationOptions && customizationOptions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Customize Your Order</h4>
                {customizationOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={selectedCustomizations.includes(option.id)}
                      onCheckedChange={() =>
                        handleCustomizationToggle(option.id)
                      }
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex justify-between w-full"
                    >
                      <span>{option.name}</span>
                      <span className="text-gray-500">
                        +${option.price.toFixed(2)}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="font-medium">
                Total: ${calculateTotalPrice().toFixed(2)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodItemCard;
