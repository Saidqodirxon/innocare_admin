"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getBanners,
  deleteBanner,
  type BannerData,
} from "@/src/lib/api/partners";
import { useToast } from "@/src/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import Image from "next/image";

export default function BannersPage() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchBanners = async () => {
    try {
      const data = await getBanners();
      setBanners(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось получить Партнерыы",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [toast]);

  const handleDelete = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteBanner(bannerToDelete);
      toast({
        title: "Успешно",
        description: "Партнеры успешно удален",
      });
      fetchBanners();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось удалить Партнеры",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Список Партнеры</h2>
        <Button onClick={() => router.push("/dashboard/partners/create")}>
          <Plus className="mr-2 h-4 w-4" /> Добавить Партнеры
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : !Array.isArray(banners) || banners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Партнерыы не найдены. Создайте первый Партнеры.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Изображение</TableHead>
              <TableHead>Название (UZ)</TableHead>
              <TableHead>Название (RU)</TableHead>
              <TableHead>Название (EN)</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner: any) => (
              <TableRow key={banner._id}>
                <TableCell>
                  {banner.image && banner.image.url ? (
                    <Image
                      src={banner.image.url || "/placeholder.svg"}
                      alt={banner.name_uz}
                      className="w-16 h-16 object-cover rounded"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      Нет изображения
                    </div>
                  )}
                </TableCell>
                <TableCell>{banner.name_uz}</TableCell>
                <TableCell>{banner.name_ru}</TableCell>
                <TableCell>{banner.name_en}</TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(`/dashboard/partners/edit/${banner._id}`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(banner._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо. Партнеры будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
