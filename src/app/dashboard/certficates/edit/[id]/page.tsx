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
  getPortfolio,
  updatePortfolio,
  type PortfolioData,
} from "@/src/lib/api/certificates";
import type { ImageData } from "@/src/lib/api/certificates";
import { useToast } from "@/src/hooks/use-toast";

export default function EditPortfolioPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<PortfolioData>({
    image: {} as ImageData, // Initialize with an empty ImageData object
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio(params.id);
        setFormData(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: error.message || "Не удалось загрузить сертификат",
        });
        router.push("/dashboard/certficates");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPortfolio();
  }, [params.id, router, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || !formData.image.url) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, загрузите хотя бы одно изображение",
      });
      return;
    }

    setLoading(true);
    try {
      await updatePortfolio(params.id, formData);
      toast({
        title: "Успешно",
        description: "сертификат успешно обновлено",
      });
      router.push("/dashboard/certficates");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось обновить сертификат",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle image changes
  const handleImageChange = (value: ImageData | ImageData[]) => {
    // Since multiple={false}, value will be ImageData
    if (Array.isArray(value)) {
      setFormData((prev) => ({ ...prev, image: value[0] || {} }));
    } else {
      setFormData((prev) => ({ ...prev, image: value }));
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
        onClick={() => router.push("/dashboard/certficates")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к сертификат
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
                {loading ? "Обновление..." : "Обновить сертификат"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
