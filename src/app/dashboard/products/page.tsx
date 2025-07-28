"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getServices,
  deleteService,
  type ServiceData,
} from "@/src/lib/api/products";
import { getCategories, type CategoriesData } from "@/src/lib/api/categories";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Plus, Pencil, Trash2, FilterX } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [categories, setCategories] = useState<CategoriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    is_visible?: boolean;
    is_view?: boolean;
    categoryId?: string;
    searchQuery?: string;
  }>({});

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories("/categories");
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось загрузить категории",
      });
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getServices("services", {
        q: filters.searchQuery,
        is_visible: filters.is_visible,
        is_view: filters.is_view,
        categoryId: filters.categoryId,
      });
      const serviceData = Array.isArray(response.data) ? response.data : [];
      setServices(serviceData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось загрузить услуги",
      });
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value === "all") {
        delete newFilters[key];
      } else {
        if (key === "is_visible" || key === "is_view") {
          newFilters[key] = value === "true";
        } else {
          newFilters[key] = value;
        }
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const confirmDelete = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteService(serviceToDelete);
      toast({ title: "Успешно", description: "Услуга успешно удалена" });
      fetchServices();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось удалить услугу",
      });
    } finally {
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const getCategoryName = (id: string) =>
    categories.find((cat) => cat._id === id)?.name_uz || "—";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Список услуг</h2>
        <Button onClick={() => router.push("/dashboard/products/create")}>
          <Plus className="mr-2 h-4 w-4" /> Добавить услугу
        </Button>
      </div>

      {/* 🔍 Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по названию"
          className="p-2 border rounded-md w-full max-w-xs"
          onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
        />
      </div>

      {/* 🔽 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Select
          value={filters.categoryId || "all"}
          onValueChange={(value) => handleFilterChange("categoryId", value)}
        >
          <SelectTrigger><SelectValue placeholder="Категория" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id ?? ""} value={cat._id ?? ""}>
                {cat.name_uz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.is_visible?.toString() || "all"}
          onValueChange={(value) => handleFilterChange("is_visible", value)}
        >
          <SelectTrigger><SelectValue placeholder="На главной" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="true">На главной</SelectItem>
            <SelectItem value="false">Скрыто</SelectItem>
          </SelectContent>
        </Select>

        {/* <Select
          value={filters.is_view?.toString() || "all"}
          onValueChange={(value) => handleFilterChange("is_view", value)}
        >
          <SelectTrigger><SelectValue placeholder="Стиль" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="true">Стиль 1</SelectItem>
            <SelectItem value="false">Стиль 2</SelectItem>
          </SelectContent>
        </Select> */}

        <Button variant="outline" onClick={clearFilters}>
          <FilterX className="mr-2 h-4 w-4" /> Очистить
        </Button>
      </div>

      {/* 📄 Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Нет услуг по текущим фильтрам.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Главная</TableHead>
              <TableHead>Стиль</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>
                  {service.image && service.image.length > 0 ? (
                    <Image
                      src={service.image[0].url}
                      alt={service.name_uz}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded" />
                  )}
                </TableCell>
                <TableCell>{service.name_ru}</TableCell>
                <TableCell>{getCategoryName(service.categoryId)}</TableCell>
                <TableCell>{service.is_visible ? "Да" : "Нет"}</TableCell>
                <TableCell>{service.is_view ? "Стиль 1" : "Стиль 2"}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      router.push(`/dashboard/products/edit/${service._id}`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => confirmDelete(service._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* 🗑 Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить эту услугу?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
