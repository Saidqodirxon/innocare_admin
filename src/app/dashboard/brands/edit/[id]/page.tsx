"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { FileUpload } from "@/src/components/file-upload";
import {
  getBrands,
  updateBrands,
  type BrandsData,
} from "@/src/lib/api/brands";
import type { ImageData } from "@/src/lib/api/brands";
import { useToast } from "@/src/hooks/use-toast";

export default function EditCategoriesPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<BrandsData>({
    name: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getBrands(params.id);
        const category = Array.isArray(data) ? data[0] : data; // Ensure a single object is selected
        setFormData(category);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: error.message || "Не удалось получить категория",
        });
        router.push("/dashboard/categories");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategories();
  }, [params.id, router, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: ImageData | ImageData[] | null) => {
    if (value && !Array.isArray(value)) {
      setFormData((prev) => ({ ...prev, image: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await updateBrands(params.id, formData);
      toast({
        title: "Успешно",
        description: "Бренд успешно обновлён",
      });
      router.push("/dashboard/brands");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось обновить бренд",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/dashboard/brands")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к брендам
      </Button>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Создание..." : "Создать категория"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
