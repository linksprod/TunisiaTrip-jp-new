import React from "react";
import { EnhancedAdminLayout } from "@/components/admin/modern/EnhancedAdminLayout";
import { MediaLibrary } from "@/components/admin/modern/MediaLibrary";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const AdminMediaPage = () => {
  const { currentLanguage } = useTranslation();

  return (
    <EnhancedAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            <TranslateText text="Media Management" />
          </h1>
          <p className="text-muted-foreground mt-2">
            <TranslateText text="Manage website images with automatic compression and WebP conversion." />
          </p>
        </div>

        <MediaLibrary />
      </div>
    </EnhancedAdminLayout>
  );
};

export default AdminMediaPage;
