"use client";
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { useExpandable } from "@/hooks/use-expandable";

export function ProjectStatusCard({
  title,
  progress,
  dueDate,
  tasks,
  openIssues,
  customContent,
  imageUrl,
  statusBadge,
  footerContent
}) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  return (
    <Card
      className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg bg-white/90 backdrop-blur-sm border-green-100"
      onClick={toggleExpand}>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start w-full">
          <div className="space-y-2">
            {statusBadge}
            <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
          </div>
        </div>
      </CardHeader>

      {/* Image Section */}
      {imageUrl && (
        <div className="relative h-48 bg-gray-200 mx-4 my-2 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[oklch(59.6%_0.145_163.225)]">
              <span>Time until expiry</span>
              <span>{openIssues} days</span>
            </div>
            <ProgressBar value={progress} className="h-2 [&>div]:bg-[#45A180]" />
          </div>

          <motion.div
            style={{ height: animatedHeight }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden">
            <div ref={contentRef}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 pt-2">
                    <div className="flex items-center justify-between text-sm text-[oklch(59.6%_0.145_163.225)]">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Expires {dueDate}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {tasks.map((task, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-900">{task.title}</span>
                          {task.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>

                    {customContent}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </CardContent>
      <CardFooter>
        {footerContent}
      </CardFooter>
    </Card>
  );
}