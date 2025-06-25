import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Download,
  Link as LinkIcon,
  Clock,
  Shield,
  FileText,
  ChevronDown,
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FileStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
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
  const stats = {
    totalFiles: mockFiles.length,
    activeFiles: mockFiles.filter((f) => f.status === "active").length,
    totalDownloads: mockFiles.reduce((sum, f) => sum + f.downloads, 0),
  };
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Files</p>
              <p className="text-2xl font-semibold">{stats.totalFiles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Files</p>
              <p className="text-2xl font-semibold">{stats.activeFiles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
              <p className="text-2xl font-semibold">{stats.totalDownloads}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as FileStatus | "all")
            }
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="downloaded">Downloaded</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="downloads">Sort by Downloads</option>
          </select>
        </div>
      </div>
      {/* Files Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="border-b last:border-b-0 hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">{file.name}</span>
                      {file.passwordProtected && (
                        <Shield className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(file.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {file.downloads}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${
                        file.status === "active"
                          ? "bg-green-100 text-green-700"
                          : file.status === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {file.status.charAt(0).toUpperCase() +
                        file.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-muted rounded-md transition-colors">
                        <LinkIcon className="h-4 w-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-md transition-colors">
                        <Download className="h-4 w-4 text-primary" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
