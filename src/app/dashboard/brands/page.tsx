"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getBrands,
  deleteBrands,
  type BrandsData,
} from "@/src/lib/api/brands";
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

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandsToDelete, setBrandsToDelete] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const data = await getBrands("");
      setBrands(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось получить бренды",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [toast]);

  const handleDelete = async () => {
    if (!brandsToDelete) return;

    try {
      await deleteBrands(brandsToDelete);
      toast({
        title: "Успешно",
        description: "Бренд успешно удален",
      });
      fetchCategories();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось удалить категория",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBrandsToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setBrandsToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Список брендов</h2>
        <Button onClick={() => router.push("/dashboard/brands/create")}>
          <Plus className="mr-2 h-4 w-4" /> Добавить бренд
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : !Array.isArray(brands) || brands.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Баннеры не найдены. Создайте первый бренд.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>

              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand: any) => (
              <TableRow key={brand._id}>
                <TableCell>{brand.name}</TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(
                        `/dashboard/brands/edit/${brand._id}`
                      )
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(brand._id!)}
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
              Это действие необратимо. Баннер будет удален навсегда.
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
