
import React, { useState } from "react";
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

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  submittedDate: string;
  status: 'new' | 'responded' | 'archived';
}

// Mock data for contacts
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Akira Tanaka",
    email: "akira.tanaka@example.com",
    message: "Hello, I'm interested in booking a group tour for next month. Can you provide more information about your packages?",
    subject: "Group Tour Inquiry",
    submittedDate: "2025-05-05",
    status: 'new'
  },
  {
    id: "2",
    name: "Sophie Martin",
    email: "sophie.m@example.com",
    message: "I have questions about the visa requirements for French citizens. Can you help me with the process?",
    subject: "Visa Information",
    submittedDate: "2025-05-03",
    status: 'responded'
  },
  {
    id: "3",
    name: "John Smith",
    email: "jsmith@example.com",
    message: "Are there any special tours available during the summer months? I'm planning to visit in July.",
    subject: "Summer Tours",
    submittedDate: "2025-05-01",
    status: 'archived'
  },
  {
    id: "4",
    name: "Maria Rodriguez",
    email: "maria.r@example.com",
    message: "Do you offer private tours for families with young children? We need something age-appropriate.",
    subject: "Family Tours",
    submittedDate: "2025-04-28",
    status: 'new'
  },
  {
    id: "5",
    name: "Ahmed Hassan",
    email: "a.hassan@example.com",
    message: "I'm a photographer looking to capture Tunisia's landscapes. Are there any photography-focused tours?",
    subject: "Photography Tours",
    submittedDate: "2025-04-25",
    status: 'responded'
  }
];

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'responded' | 'archived'>('all');
  const { currentLanguage, t } = useTranslation();
  const { toast } = useToast();

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailDialogOpen(true);
  };

  const handleUpdateStatus = (contactId: string, newStatus: 'new' | 'responded' | 'archived') => {
    setContacts(contacts.map(contact => {
      if (contact.id === contactId) {
        return { ...contact, status: newStatus };
      }
      return contact;
    }));

    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact({ ...selectedContact, status: newStatus });
    }
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
    if (selectedContact && selectedContact.id === contactId) {
      setIsDetailDialogOpen(false);
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
        <div>
          <h1 className="text-3xl font-bold">
            <TranslateText text="Contact Management" language={currentLanguage} />
          </h1>
          <p className="text-muted-foreground mt-2">
            <TranslateText text="Manage and respond to contact form submissions." language={currentLanguage} />
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <TranslateText text="Contact Form Submissions" language={currentLanguage} />
            </CardTitle>
            <CardDescription>
              <TranslateText text="Review and manage all contact inquiries." language={currentLanguage} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={(value) => setActiveFilter(value as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  <TranslateText text="All Contacts" language={currentLanguage} />
                </TabsTrigger>
                <TabsTrigger value="new">
                  <TranslateText text="New" language={currentLanguage} />
                </TabsTrigger>
                <TabsTrigger value="responded">
                  <TranslateText text="Responded" language={currentLanguage} />
                </TabsTrigger>
                <TabsTrigger value="archived">
                  <TranslateText text="Archived" language={currentLanguage} />
                </TabsTrigger>
              </TabsList>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <TranslateText text="Date" language={currentLanguage} />
                    </TableHead>
                    <TableHead>
                      <TranslateText text="Name" language={currentLanguage} />
                    </TableHead>
                    <TableHead>
                      <TranslateText text="Email" language={currentLanguage} />
                    </TableHead>
                    <TableHead>
                      <TranslateText text="Subject" language={currentLanguage} />
                    </TableHead>
                    <TableHead>
                      <TranslateText text="Status" language={currentLanguage} />
                    </TableHead>
                    <TableHead className="text-right">
                      <TranslateText text="Actions" language={currentLanguage} />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map(contact => (
                    <TableRow key={contact.id}>
                      <TableCell>{contact.submittedDate}</TableCell>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject || t("General Inquiry")}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contact.status)}>
                          <TranslateText text={contact.status.charAt(0).toUpperCase() + contact.status.slice(1)} language={currentLanguage} />
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(contact)}
                        >
                          <TranslateText text="View Details" language={currentLanguage} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              <TranslateText text="Contact Details" language={currentLanguage} />
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Name" language={currentLanguage} />
                  </p>
                  <p className="text-sm">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Email" language={currentLanguage} />
                  </p>
                  <p className="text-sm">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Date Submitted" language={currentLanguage} />
                  </p>
                  <p className="text-sm">{selectedContact.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Subject" language={currentLanguage} />
                  </p>
                  <p className="text-sm">{selectedContact.subject || t("General Inquiry")}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    <TranslateText text="Message" language={currentLanguage} />
                  </p>
                  <div className="border rounded-md p-3 mt-1 bg-gray-50">
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedContact.id, 'new')}
                    disabled={selectedContact.status === 'new'}
                  >
                    <TranslateText text="Mark as New" language={currentLanguage} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedContact.id, 'responded')}
                    disabled={selectedContact.status === 'responded'}
                  >
                    <TranslateText text="Mark as Responded" language={currentLanguage} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedContact.id, 'archived')}
                    disabled={selectedContact.status === 'archived'}
                  >
                    <TranslateText text="Archive" language={currentLanguage} />
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteContact(selectedContact.id)}
                >
                  <TranslateText text="Delete" language={currentLanguage} />
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
