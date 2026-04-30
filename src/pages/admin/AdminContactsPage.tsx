
import React, { useState, useEffect } from "react";
import { EnhancedAdminLayout } from "@/components/admin/modern/EnhancedAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  submitted_date: string;
  status: 'new' | 'responded' | 'archived';
}

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'responded' | 'archived'>('all');
  const { currentLanguage, t } = useTranslation();
  const { toast } = useToast();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('submitted_date', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Failed to load contact submissions.")
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (contactId: string, newStatus: 'new' | 'responded' | 'archived') => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status: newStatus })
        .eq('id', contactId);

      if (error) throw error;

      setContacts(contacts.map(contact => {
        if (contact.id === contactId) {
          return { ...contact, status: newStatus };
        }
        return contact;
      }));

      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }

      toast({
        title: t("Status Updated"),
        description: t("The contact status has been updated successfully.")
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Failed to update status.")
      });
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm(t("Are you sure you want to delete this contact?"))) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      setContacts(contacts.filter(contact => contact.id !== contactId));
      if (selectedContact && selectedContact.id === contactId) {
        setIsDetailDialogOpen(false);
      }

      toast({
        title: t("Deleted"),
        description: t("Contact submission has been deleted.")
      });
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Failed to delete contact.")
      });
    }
  };

  const filteredContacts = activeFilter === 'all'
    ? contacts
    : contacts.filter(contact => contact.status === activeFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <EnhancedAdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              <TranslateText text="Contact Management" />
            </h1>
            <p className="text-muted-foreground mt-2">
              <TranslateText text="Manage and respond to contact form submissions." />
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchContacts} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <TranslateText text="Refresh" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <TranslateText text="Contact Form Submissions" />
            </CardTitle>
            <CardDescription>
              <TranslateText text="Review and manage all contact inquiries." />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={(value) => setActiveFilter(value as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  <TranslateText text="All Contacts" />
                </TabsTrigger>
                <TabsTrigger value="new">
                  <TranslateText text="New" />
                </TabsTrigger>
                <TabsTrigger value="responded">
                  <TranslateText text="Responded" />
                </TabsTrigger>
                <TabsTrigger value="archived">
                  <TranslateText text="Archived" />
                </TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">
                    <TranslateText text="Loading submissions..." />
                  </p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">
                    <TranslateText text="No contact submissions found." />
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <TranslateText text="Date" />
                      </TableHead>
                      <TableHead>
                        <TranslateText text="Name" />
                      </TableHead>
                      <TableHead>
                        <TranslateText text="Email" />
                      </TableHead>
                      <TableHead>
                        <TranslateText text="Subject" />
                      </TableHead>
                      <TableHead>
                        <TranslateText text="Status" />
                      </TableHead>
                      <TableHead className="text-right">
                        <TranslateText text="Actions" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map(contact => (
                      <TableRow key={contact.id}>
                        <TableCell>{contact.submitted_date}</TableCell>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.subject || t("General Inquiry")}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(contact.status)}>
                            <TranslateText text={contact.status.charAt(0).toUpperCase() + contact.status.slice(1)} />
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(contact)}
                          >
                            <TranslateText text="View Details" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              <TranslateText text="Contact Details" />
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Name" />
                  </p>
                  <p className="text-sm">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Email" />
                  </p>
                  <p className="text-sm">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      <TranslateText text="Phone" />
                    </p>
                    <p className="text-sm">{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Date Submitted" />
                  </p>
                  <p className="text-sm">{selectedContact.submitted_date}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Subject" />
                  </p>
                  <p className="text-sm">{selectedContact.subject || t("General Inquiry")}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Message" />
                  </p>
                  <div className="border rounded-md p-3 mt-1 bg-gray-50">
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedContact.id, 'new')}
                    disabled={selectedContact.status === 'new'}
                  >
                    <TranslateText text="Mark as New" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedContact.id, 'responded')}
                    disabled={selectedContact.status === 'responded'}
                  >
                    <TranslateText text="Mark as Responded" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedContact.id, 'archived')}
                    disabled={selectedContact.status === 'archived'}
                  >
                    <TranslateText text="Archive" />
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteContact(selectedContact.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <TranslateText text="Delete" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </EnhancedAdminLayout>
  );
};

export default AdminContactsPage;
