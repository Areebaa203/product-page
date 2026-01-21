import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import axios from "axios";

// Schema for validation
const productSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  price: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive({ message: "Price must be a positive number." })
  ),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  thumbnail: z.string().url({
    message: "Please enter a valid URL for the image.",
  }),
});

const CreateProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productToEdit = location.state?.product;
  const isEditMode = !!productToEdit;

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: "",
      description: "",
      category: "",
      thumbnail: "",
    },
  });

  useEffect(() => {
    if (isEditMode && productToEdit) {
      form.reset({
        title: productToEdit.title,
        price: productToEdit.price,
        description: productToEdit.description,
        category: productToEdit.category,
        thumbnail: productToEdit.thumbnail,
      });
    }
  }, [isEditMode, productToEdit, form]);

  const onSubmit = async (values) => {
    console.log("Form Submitted:", values);
    try {
  // 1. Edit Mode: Update in localStorage if it exists there
      if (isEditMode) {
         // Try to find and update in local storage first
         const localProducts = JSON.parse(localStorage.getItem("userProducts") || "[]");
         const index = localProducts.findIndex(p => p.id === productToEdit.id);
         
         if (index !== -1) {
             const updatedProduct = { ...localProducts[index], ...values };
             localProducts[index] = updatedProduct;
             localStorage.setItem("userProducts", JSON.stringify(localProducts));
             console.log("Updated locally:", updatedProduct);
         } else {
             // Fallback for API products (simulated)
             await axios.put(`https://dummyjson.com/products/${productToEdit.id}`, values);
         }
         alert(`Product "${values.title}" updated successfully!`);
      } else {
        // 2. Add Mode: Create and save to localStorage
        const res = await axios.post("https://dummyjson.com/products/add", values);
        
        // Enhance with local flag and ensure ID is unique (using timestamp) if API id collides or just use what api gives + random
        // DummyJSON always returns same ID 195 for add... so we need a unique ID for local list
        const newProduct = { 
            ...values, 
            id: Date.now(), // Unique ID for local
            thumbnail: values.thumbnail || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
            isUserCreated: true 
        };

        const localProducts = JSON.parse(localStorage.getItem("userProducts") || "[]");
        localProducts.unshift(newProduct);
        localStorage.setItem("userProducts", JSON.stringify(localProducts));

        console.log("Saved locally:", newProduct);
        alert(`Product "${values.title}" created and saved locally!`);
      }
      navigate(-1); // Go back
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 sm:px-10 md:px-12 py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-slate-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <CardTitle className="text-2xl font-bold text-slate-800">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="fragrances">Fragrances</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="groceries">Groceries</SelectItem>
                        <SelectItem value="home-decoration">
                          Home Decoration
                        </SelectItem>
                        <SelectItem value="kitchen-accessories">
                          Kitchen Accessories
                        </SelectItem>
                        <SelectItem value="laptops">Laptops</SelectItem>
                        <SelectItem value="mens-shirts">Mens Shirts</SelectItem>
                        <SelectItem value="mens-shoes">Mens Shoes</SelectItem>
                        <SelectItem value="mens-watches">Mens Watches</SelectItem>
                        <SelectItem value="mobile-accessories">
                          Mobile Accessories
                        </SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="skin-care">Skin Care</SelectItem>
                        <SelectItem value="smartphones">Smartphones</SelectItem>
                        <SelectItem value="sports-accessories">
                          Sports Accessories
                        </SelectItem>
                        <SelectItem value="sunglasses">Sunglasses</SelectItem>
                        <SelectItem value="tablets">Tablets</SelectItem>
                        <SelectItem value="tops">Tops</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="womens-bags">Womens Bags</SelectItem>
                        <SelectItem value="womens-dresses">
                          Womens Dresses
                        </SelectItem>
                        <SelectItem value="womens-jewellery">
                          Womens Jewellery
                        </SelectItem>
                        <SelectItem value="womens-shoes">Womens Shoes</SelectItem>
                        <SelectItem value="womens-watches">
                          Womens Watches
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product Description..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
              {isEditMode ? "Update Product" : "Create Product"}
            </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;
