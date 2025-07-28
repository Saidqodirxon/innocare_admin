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
  getService,
  updateService,
  type ServiceData,
} from "@/src/lib/api/products";
import type { ImageData } from "@/src/lib/api/partners";
import { useToast } from "@/src/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { getCategories, type CategoriesData } from "@/src/lib/api/categories";
import { getBrands } from "@/src/lib/api/brands";

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<CategoriesData[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [formData, setFormData] = useState<ServiceData>({
    name_uz: "",
    name_ru: "",
    name_en: "",
    description_uz: "",
    description_ru: "",
    description_en: "",
    categoryId: "",
    image: [],
    brandId: "",
    file: {
      url: "",
      id: "",
    },
    // video: "",
    // link_1: "",
    // link_2: "",
    // link_3: "",
    is_visible: false,
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories("/categories");
        console.log("Fetched categories:", response); // Debug uchun
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error); // Debug uchun
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить категории",
        });
      }
    };
    fetchCategories();
  }, [toast]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getBrands("/brands");
        console.log("Fetched brands:", response); // Debug uchun
        setBrands(response);
      } catch (error) {
        console.error("Error fetching brands:", error); // Debug uchun
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить бренды",
        });
      }
    };
    fetchBrands();
  }, [toast]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const resolvedParams = await params;
        const data = await getService(resolvedParams.id);
        setFormData(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: error.message || "Не удалось получить данные услуги",
        });
        router.push("/dashboard/products");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchService();
  }, [params, router, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: ImageData | ImageData[] | null) => {
    const images = Array.isArray(value) ? value : value ? [value] : [];
    setFormData((prev) => ({ ...prev, image: images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || formData.image.length === 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, загрузите хотя бы одно изображение",
      });
      return;
    }

    setLoading(true);
    try {
      const resolvedParams = await params;
      await updateService(resolvedParams.id, formData);
      toast({
        title: "Успешно",
        description: "Услуга успешно обновлена",
      });
      router.push("/dashboard/products");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось обновить услугу",
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
        onClick={() => router.push("/dashboard/products")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к услугам
      </Button>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nomi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["uz", "ru", "en"].map((lang) => (
                <div className="space-y-2" key={lang}>
                  <Label htmlFor={`name_${lang}`}>Название ({lang.toUpperCase()})</Label>
                  <Input
                    id={`name_${lang}`}
                    name={`name_${lang}`}
                    value={(formData as any)[`name_${lang}`]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Tavsif */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["uz", "ru", "en"].map((lang) => (
                <div className="space-y-2" key={lang}>
                  <Label htmlFor={`description_${lang}`}>Описание ({lang.toUpperCase()})</Label>
                  <Textarea
                    id={`description_${lang}`}
                    name={`description_${lang}`}
                    value={(formData as any)[`description_${lang}`]}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["uz", "ru", "en"].map((lang) => (
                <div className="space-y-2" key={lang}>
                  <Label htmlFor={`about_${lang}`}>Дополнительная информация ({lang.toUpperCase()})</Label>
                  <Textarea
                    id={`about_${lang}`}
                    name={`about_${lang}`}
                    value={(formData as any)[`about_${lang}`]}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Video va linklar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Input name="video" placeholder="Ссылка на видео" value={formData.video} onChange={handleChange} />
              <Input name="link_1" placeholder="Ссылка Uzum" value={formData.link_1} onChange={handleChange} />
              <Input name="link_2" placeholder="Ссылка Yandex" value={formData.link_2} onChange={handleChange} />
              <Input name="link_3" placeholder="Ссылка Аптека" value={formData.link_3} onChange={handleChange} />
            </div>

            {/* Select: Kategoriya / Brend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Категория</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger><SelectValue placeholder="Выберите категорию" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id ?? ""} value={cat._id ?? ""}>{cat.name_ru}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Бренд</Label>
                <Select
                  value={formData.brandId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, brandId: value }))}
                >
                  <SelectTrigger><SelectValue placeholder="Выберите бренд" /></SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand._id ?? ""} value={brand._id ?? ""}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* is_visible va is_view */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 flex items-center gap-2">
                <Input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_visible: e.target.checked }))}
                />
                <span>Показать на главной странице</span>
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <Input
                  type="checkbox"
                  checked={formData.is_view}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_view: e.target.checked }))}
                />
                <span>Стиль отображения: {formData.is_view ? "Вид 1" : "Вид 2"}</span>
              </div>
            </div>

            {/* Fayllar */}
            <div className="space-y-2">
              <Label>Файлы услуги</Label>
              <FileUpload
                multiple={false}
                accept=".pdf,.doc,.docx"
                isFile
                value={formData.file}
                onChange={(value) => {
                  const file = Array.isArray(value) ? value[0] : value || { url: "", id: "" };
                  setFormData((prev) => ({ ...prev, file }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Изображения услуги</Label>
              <FileUpload
                multiple
                accept=".jpg,.jpeg,.png"
                value={formData.image}
                onChange={handleImageChange}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Создание..." : "Создать услугу"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
