import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FileText, Shield, LinkIcon, Download } from "lucide-react";
import { Ifile } from "@/interface/IFileInterface";
import { getSharableFileLink } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface FileTableProps {
  files: Ifile[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function FileTable({
  files,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
}: FileTableProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="px-6 py-3">Name</TableHead>
                <TableHead className="px-6 py-3">Created</TableHead>
                <TableHead className="px-6 py-3">Expires</TableHead>
                <TableHead className="px-6 py-3">Size</TableHead>
                <TableHead className="px-6 py-3">Downloads</TableHead>
                <TableHead className="px-6 py-3">Status</TableHead>
                <TableHead className="px-6 py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id} className="hover:bg-muted/20">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">{file.name}</span>
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground text-sm">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground text-sm">
                    {new Date("2025-10-15T10:00:00").toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground text-sm">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground text-sm">
                    {3}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {/* <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        file.status === "active"
                          ? "bg-green-100 text-green-700"
                          : file.status === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {file.status.charAt(0).toUpperCase() +
                        file.status.slice(1)}
                    </span> */}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${getSharableFileLink(file.id)}`
                          );
                          alert("🔗 Link copied to clipboard!");
                        }}
                      >
                        <LinkIcon className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigate(`/decrypt/${btoa(file.id.toString())}`, {
                            state: {
                              from: "myFiles",
                            },
                          });
                        }}
                      >
                        <Download className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent className="justify-end">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          <PaginationItem>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
