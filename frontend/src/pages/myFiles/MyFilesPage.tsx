import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllFiles } from "@/services/webApis/webApis";
import { Ifile } from "@/interface/IFileInterface";
import StatsCards from "./sections/StatsCards";
import FilterSection from "./sections/FilterSection";
import { FileTable } from "@/components/table/FileTable";

type FileStatus = "active" | "expired" | "downloaded";
type SortBy = "name" | "date" | "size" | "downloads";
interface EncryptedFile {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  expiresAt: string;
  downloads: number;
  status: FileStatus;
  passwordProtected: boolean;
}
const mockFiles: EncryptedFile[] = [
  {
    id: "1",
    name: "confidential-report-2025.pdf",
    size: 2.4 * 1024 * 1024,
    createdAt: "2025-09-15T10:00:00",
    expiresAt: "2025-10-15T10:00:00",
    downloads: 3,
    status: "active",
    passwordProtected: true,
  },
  {
    id: "2",
    name: "project-presentation.pptx",
    size: 5.7 * 1024 * 1024,
    createdAt: "2025-09-14T15:30:00",
    expiresAt: "2025-10-14T15:30:00",
    downloads: 8,
    status: "active",
    passwordProtected: false,
  },
  {
    id: "3",
    name: "financial-data.xlsx",
    size: 1.2 * 1024 * 1024,
    createdAt: "2025-09-10T09:15:00",
    expiresAt: "2025-09-12T09:15:00",
    downloads: 5,
    status: "expired",
    passwordProtected: true,
  },
];
export function MyFilesPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(mockFiles.length / 10); // Assuming 10 files per page
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FileStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");

  const stats = {
    totalFiles: mockFiles.length,
    activeFiles: mockFiles.filter((f) => f.status === "active").length,
    totalDownloads: mockFiles.reduce((sum, f) => sum + f.downloads, 0),
  };

  const { isPending, data: allFile = [] } = useQuery<Ifile[]>({
    queryKey: ["files"],
    queryFn: getAllFiles,
  });

  const filteredFiles = mockFiles
    .filter(
      (file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === "all" || file.status === statusFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size - a.size;
        case "downloads":
          return b.downloads - a.downloads;
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">My Encrypted Files</h1>
          <p className="text-muted-foreground">
            Manage and track your encrypted files
          </p>
        </div>
        <Link
          to="/encrypt"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Encrypt New File
        </Link>
      </div>
      {/* Stats Cards */}
      <StatsCards />

      {/* Search and Filters */}
      <FilterSection />

      {/* Files Table */}
      <FileTable
        files={allFile}
        currentPage={page}
        pageSize={10}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
