"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { FileUpload } from "@/src/components/file-upload";
import { createPortfolio, type PortfolioData } from "@/src/lib/api/certificates";
import type { ImageData } from "@/src/lib/api/partners";
import { useToast } from "@/src/hooks/use-toast";

export default function CreatePortfolioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PortfolioData>({
    image: {} as ImageData, // Initialize with an empty ImageData object
  });

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

    if (!formData.image) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, загрузите хотя бы одно изображение",
      });
      return;
    }

    setLoading(true);
    try {
      await createPortfolio(formData);
      toast({
        title: "Успешно",
        description: "сертификат успешно создано",
      });
      router.push("/dashboard/certficates");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось создать сертификат",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/dashboard/certficates")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к сертификатам
      </Button>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Изображения сертификат</Label>
              <FileUpload
                multiple={false}
                value={formData.image}
                onChange={handleImageChange}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Создание..." : "Создать сертификат"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div >
  );
}
