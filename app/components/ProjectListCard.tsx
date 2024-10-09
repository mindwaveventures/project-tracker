import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  id: string;
  projectName: string;
  createdBy: {
    name: string;
    avatarUrl: string;
  };
  taskCount: Number;
}

export default function ProjectListCard({
  id,
  projectName,
  createdBy,
  taskCount,
}: ProjectCardProps) {
  const router = useRouter();
  return (
    <Card
      className="w-full max-w-sm cursor-pointer"
      onClick={() => router.push(`/projects/task/${id}`)}
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold">{projectName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={createdBy.avatarUrl} alt={createdBy.name} />
            <AvatarFallback>{createdBy.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Created by</p>
            <p className="text-sm text-muted-foreground">{createdBy.name}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Badge variant="secondary" className="flex items-center space-x-2">
          <ClipboardList className="h-4 w-4" />
          <span> {taskCount} tasks</span>
        </Badge>
      </CardFooter>
    </Card>
  );
}
