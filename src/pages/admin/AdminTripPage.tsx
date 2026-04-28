import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Trash2, Plus, Upload, Calendar } from "lucide-react";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import { DayTimelineEditor } from "@/components/admin/DayTimelineEditor";
import { useActivities, Activity } from "@/hooks/useActivities";
import { useHotels, Hotel } from "@/hooks/useHotels";
import { useGuestHouses, GuestHouse } from "@/hooks/useGuestHouses";
import { useAirports, Airport } from "@/hooks/useAirports";
import { useAllPredefinedTrips, useCreatePredefinedTrip, useUpdatePredefinedTrip, useDeletePredefinedTrip, PredefinedTrip } from "@/hooks/usePredefinedTrips";
import { DetailedDayPlan, TimelineActivity } from "@/types/predefinedTripTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const AdminTripPage = () => {
  const { activities, createActivity, updateActivity, deleteActivity, isLoading: activitiesLoading } = useActivities();
  const { hotels, createHotel, updateHotel, deleteHotel, isLoading: hotelsLoading } = useHotels();
  const { guestHouses, createGuestHouse, updateGuestHouse, deleteGuestHouse, isLoading: guestHousesLoading } = useGuestHouses();
  const { airports, createAirport, updateAirport, deleteAirport, isLoading: airportsLoading } = useAirports();
  const { data: predefinedTrips = [], isLoading: tripsLoading } = useAllPredefinedTrips();
  const createTrip = useCreatePredefinedTrip();
  const updateTrip = useUpdatePredefinedTrip();
  const deleteTrip = useDeletePredefinedTrip();
  const { currentLanguage, t } = useTranslation();

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Current tab and editing states
  const [currentTab, setCurrentTab] = useState("activities");
  const [editingItem, setEditingItem] = useState<Activity | Hotel | GuestHouse | Airport | PredefinedTrip | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Form states
  const [newItem, setNewItem] = useState<Partial<Activity | Hotel | GuestHouse | Airport | PredefinedTrip>>({});

  // Day-by-day trip planning state - modified to support multiple activities per day
  const [daySelections, setDaySelections] = useState<{
    [day: number]: {
      activities: string[]; // Array of activity IDs
      accommodationId: string;
      accommodationType: 'hotel' | 'guesthouse' | 'none' | '';
    }
  }>({});

  // Detailed day planning state
  const [detailedDays, setDetailedDays] = useState<DetailedDayPlan[]>([]);
  const [useDetailedPlanning, setUseDetailedPlanning] = useState(false);

  const renderRatingStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const handleEditItem = (item: Activity | Hotel | GuestHouse | Airport | PredefinedTrip) => {
    setEditingItem(item);
    // Load trip data for editing
    if (currentTab === "predefined-trips") {
      const trip = item as PredefinedTrip;

      // Try to extract detailed planning data first
      extractDetailedDataFromTrip(trip);

      // Set up simple planning data as fallback
      const selections: typeof daySelections = {};
      for (let day = 1; day <= trip.duration_days; day++) {
        const activityId = trip.activity_ids?.[day - 1] || '';
        const hotelId = trip.hotel_ids?.[day - 1] || '';
        const guesthouseId = trip.guesthouse_ids?.[day - 1] || '';

        selections[day] = {
          activities: activityId ? [activityId] : [],
          accommodationId: hotelId || guesthouseId,
          accommodationType: hotelId ? 'hotel' : guesthouseId ? 'guesthouse' : 'none'
        };
      }
      setDaySelections(selections);
    }
    setEditDialogOpen(true);
  };

  const handleAddItem = () => {
    setNewItem({});
    setDaySelections({});
    setDetailedDays([]);
    setUseDetailedPlanning(false);
    setAddDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem?.id) return;

    if (currentTab === "activities") {
      updateActivity(editingItem as Activity);
    } else if (currentTab === "hotels") {
      updateHotel(editingItem as Hotel);
    } else if (currentTab === "guesthouses") {
      updateGuestHouse(editingItem as GuestHouse);
    } else if (currentTab === "airports") {
      updateAirport(editingItem as Airport);
    } else if (currentTab === "predefined-trips") {
      // Convert day selections to arrays before saving
      const tripData = convertDetailedDaysToTrip(editingItem as PredefinedTrip);
      updateTrip.mutate({ ...tripData, id: editingItem.id } as Partial<PredefinedTrip> & { id: string });
    }

    setEditDialogOpen(false);
    setEditingItem(null);
    setDaySelections({});
  };

  const handleAddNewItem = () => {
    if (currentTab === "activities") {
      createActivity(newItem as Omit<Activity, 'id'>);
    } else if (currentTab === "hotels") {
      createHotel(newItem as Omit<Hotel, 'id'>);
    } else if (currentTab === "guesthouses") {
      createGuestHouse(newItem as Omit<GuestHouse, 'id'>);
    } else if (currentTab === "airports") {
      createAirport(newItem as Omit<Airport, 'id' | 'created_at' | 'updated_at'>);
    } else if (currentTab === "predefined-trips") {
      // Convert day selections to arrays
      const tripData = convertDetailedDaysToTrip(newItem as Omit<PredefinedTrip, 'id' | 'created_at' | 'updated_at'>);
      createTrip.mutate({
        name: '',
        duration_days: 1,
        activity_ids: [],
        hotel_ids: [],
        guesthouse_ids: [],
        images: [],
        difficulty_level: 'medium',
        is_featured: false,
        is_active: true,
        ...tripData
      } as Omit<PredefinedTrip, 'id' | 'created_at' | 'updated_at'>);
    }

    setAddDialogOpen(false);
    setNewItem({});
    setDaySelections({});
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;

    if (currentTab === "activities") {
      deleteActivity(itemToDelete);
    } else if (currentTab === "hotels") {
      deleteHotel(itemToDelete);
    } else if (currentTab === "guesthouses") {
      deleteGuestHouse(itemToDelete);
    } else if (currentTab === "airports") {
      deleteAirport(itemToDelete);
    } else if (currentTab === "predefined-trips") {
      deleteTrip.mutate(itemToDelete);
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const updateEditingField = (field: string, value: any) => {
    setEditingItem(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateNewItemField = (field: string, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
    // Reset day selections if duration changes
    if (field === 'duration_days' && currentTab === "predefined-trips") {
      setDaySelections({});
    }
  };

  // Convert day selections to trip data arrays
  const convertDaySelectionsToTrip = (baseTrip: Partial<PredefinedTrip>): Partial<PredefinedTrip> => {
    const activityIds: string[] = [];
    const hotelIds: string[] = [];
    const guesthouseIds: string[] = [];

    for (let day = 1; day <= (baseTrip.duration_days || 0); day++) {
      const dayData = daySelections[day];
      if (dayData) {
        // Add all activities from this day
        activityIds.push(...dayData.activities);

        if (dayData.accommodationType === 'hotel') {
          hotelIds.push(dayData.accommodationId || '');
          guesthouseIds.push('');
        } else if (dayData.accommodationType === 'guesthouse') {
          guesthouseIds.push(dayData.accommodationId || '');
          hotelIds.push('');
        } else {
          hotelIds.push('');
          guesthouseIds.push('');
        }
      } else {
        hotelIds.push('');
        guesthouseIds.push('');
      }
    }

    return {
      ...baseTrip,
      activity_ids: activityIds.filter(Boolean),
      hotel_ids: hotelIds.filter(Boolean),
      guesthouse_ids: guesthouseIds.filter(Boolean)
    };
  };

  // Convert detailed days to trip data for storage
  const convertDetailedDaysToTrip = (baseTrip: Partial<PredefinedTrip>): Partial<PredefinedTrip> => {
    if (!useDetailedPlanning || detailedDays.length === 0) {
      return convertDaySelectionsToTrip(baseTrip);
    }

    // Store detailed days in the description for now (until we have a proper detailed trips table integration)
    const detailedData = {
      useDetailedPlanning: true,
      detailedDays: detailedDays
    };

    return {
      ...baseTrip,
      description: `${baseTrip.description || ''}\n\n<!-- DETAILED_PLANNING_DATA: ${JSON.stringify(detailedData)} -->`
    };
  };

  // Function to extract detailed data from description
  const extractDetailedDataFromTrip = (trip: PredefinedTrip) => {
    const match = trip.description?.match(/<!-- DETAILED_PLANNING_DATA: (.*?) -->/);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        if (data.useDetailedPlanning && data.detailedDays) {
          setUseDetailedPlanning(true);
          setDetailedDays(data.detailedDays);
          return;
        }
      } catch (e) {
        console.error('Error parsing detailed planning data:', e);
      }
    }

    // Fallback to simple planning
    setUseDetailedPlanning(false);
    setDetailedDays([]);
  };

  // Update day selection with support for multiple activities
  const updateDaySelection = (day: number, field: 'accommodationId' | 'accommodationType', value: string) => {
    setDaySelections(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
        // Reset accommodation ID if type changes
        ...(field === 'accommodationType' ? { accommodationId: '' } : {})
      }
    }));
  };

  // Add activity to a specific day
  const addActivityToDay = (day: number, activityId: string) => {
    setDaySelections(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        activities: [...(prev[day]?.activities || []), activityId]
      }
    }));
  };

  // Remove activity from a specific day
  const removeActivityFromDay = (day: number, activityIndex: number) => {
    setDaySelections(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        activities: prev[day]?.activities?.filter((_, index) => index !== activityIndex) || []
      }
    }));
  };

  const renderActivityFields = (item: Partial<Activity>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">
              <TranslateText text="Title" /> *
            </Label>
            <Input
              id="title"
              value={item.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder={t("Activity Name")}
            />
          </div>
          <div>
            <Label htmlFor="location">
              <TranslateText text="Location" /> *
            </Label>
            <Input
              id="location"
              value={item.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder={t("Location")}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">
              <TranslateText text="Duration" />
            </Label>
            <Input
              id="duration"
              value={item.duration || ""}
              onChange={(e) => updateField("duration", e.target.value)}
              placeholder={t("Ex: 2 hours")}
            />
          </div>
          <div>
            <Label htmlFor="price">
              <TranslateText text="Price" />
            </Label>
            <Input
              id="price"
              value={item.price || ""}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder={t("Ex: 50€ per person")}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">
              <TranslateText text="Category" />
            </Label>
            <Select value={item.category || "activity"} onValueChange={(value) => updateField("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select a category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">
                  <TranslateText text="Activity" />
                </SelectItem>
                <SelectItem value="cultural">
                  <TranslateText text="Cultural" />
                </SelectItem>
                <SelectItem value="adventure">
                  <TranslateText text="Adventure" />
                </SelectItem>
                <SelectItem value="relaxation">
                  <TranslateText text="Relaxation" />
                </SelectItem>
                <SelectItem value="gastronomy">
                  <TranslateText text="Gastronomy" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rating">
              <TranslateText text="Rating" />
            </Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={item.rating || ""}
              onChange={(e) => updateField("rating", parseFloat(e.target.value) || 0)}
              placeholder={t("Rating out of 5")}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">
            <TranslateText text="Description" />
          </Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder={t("Activity Description")}
            className="min-h-[100px]"
          />
        </div>
        <div>
          <Label htmlFor="tags">
            <TranslateText text="Tags (comma separated)" />
          </Label>
          <Input
            id="tags"
            value={Array.isArray(item.tags) ? item.tags.join(", ") : ""}
            onChange={(e) => updateField("tags", e.target.value.split(",").map(tag => tag.trim()).filter(Boolean))}
            placeholder={t("nature, adventure, family")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">
              <TranslateText text="Latitude" />
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={item.latitude || ""}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || null)}
              placeholder={t("Ex: 35.8245")}
            />
          </div>
          <div>
            <Label htmlFor="longitude">
              <TranslateText text="Longitude" />
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={item.longitude || ""}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value) || null)}
              placeholder={t("Ex: 10.6447")}
            />
          </div>
        </div>
        <div className="space-y-4">
          <Label>
            <TranslateText text="Visibility Options" />
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_in_travel"
              checked={item.show_in_travel || false}
              onCheckedChange={(checked) => updateField("show_in_travel", checked)}
            />
            <Label htmlFor="show_in_travel">
              <TranslateText text="Show in Travel page" />
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_in_start_my_trip"
              checked={item.show_in_start_my_trip || false}
              onCheckedChange={(checked) => updateField("show_in_start_my_trip", checked)}
            />
            <Label htmlFor="show_in_start_my_trip">
              <TranslateText text="Show in Start My Trip page" />
            </Label>
          </div>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="activities"
          />
        </div>
      </>
    );
  };

  const renderHotelFields = (item: Partial<Hotel>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              <TranslateText text="Name" /> *
            </Label>
            <Input
              id="name"
              value={item.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("Hotel Name")}
            />
          </div>
          <div>
            <Label htmlFor="location">
              <TranslateText text="Location" /> *
            </Label>
            <Input
              id="location"
              value={item.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder={t("Location")}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price_per_night">
              <TranslateText text="Price per night" />
            </Label>
            <Input
              id="price_per_night"
              value={item.price_per_night || ""}
              onChange={(e) => updateField("price_per_night", e.target.value)}
              placeholder={t("Ex: 120€ per night")}
            />
          </div>
          <div>
            <Label htmlFor="rating">
              <TranslateText text="Rating" />
            </Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={item.rating || ""}
              onChange={(e) => updateField("rating", parseFloat(e.target.value) || 0)}
              placeholder={t("Rating out of 5")}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">
            <TranslateText text="Description" />
          </Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder={t("Hotel Description")}
            className="min-h-[100px]"
          />
        </div>
        <div>
          <Label htmlFor="amenities">
            <TranslateText text="Amenities (comma separated)" />
          </Label>
          <Input
            id="amenities"
            value={Array.isArray(item.amenities) ? item.amenities.join(", ") : ""}
            onChange={(e) => updateField("amenities", e.target.value.split(",").map(amenity => amenity.trim()).filter(Boolean))}
            placeholder={t("wifi, pool, restaurant")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">
              <TranslateText text="Latitude" />
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={item.latitude || ""}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || null)}
              placeholder={t("Ex: 35.8245")}
            />
          </div>
          <div>
            <Label htmlFor="longitude">
              <TranslateText text="Longitude" />
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={item.longitude || ""}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value) || null)}
              placeholder={t("Ex: 10.6447")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="breakfast"
            checked={item.breakfast || false}
            onCheckedChange={(checked) => updateField("breakfast", checked)}
          />
          <Label htmlFor="breakfast">
            <TranslateText text="Breakfast included" />
          </Label>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="hotels"
          />
        </div>
      </>
    );
  };

  const renderGuestHouseFields = (item: Partial<GuestHouse>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              <TranslateText text="Name" /> *
            </Label>
            <Input
              id="name"
              value={item.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("Guest House Name")}
            />
          </div>
          <div>
            <Label htmlFor="location">
              <TranslateText text="Location" /> *
            </Label>
            <Input
              id="location"
              value={item.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder={t("Location")}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price_per_night">
              <TranslateText text="Price per night" />
            </Label>
            <Input
              id="price_per_night"
              value={item.price_per_night || ""}
              onChange={(e) => updateField("price_per_night", e.target.value)}
              placeholder={t("Ex: 80€ per night")}
            />
          </div>
          <div>
            <Label htmlFor="rating">
              <TranslateText text="Rating" />
            </Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={item.rating || ""}
              onChange={(e) => updateField("rating", parseFloat(e.target.value) || 0)}
              placeholder={t("Rating out of 5")}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">
            <TranslateText text="Description" />
          </Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder={t("Guest House Description")}
            className="min-h-[100px]"
          />
        </div>
        <div>
          <Label htmlFor="amenities">
            <TranslateText text="Amenities (comma separated)" />
          </Label>
          <Input
            id="amenities"
            value={Array.isArray(item.amenities) ? item.amenities.join(", ") : ""}
            onChange={(e) => updateField("amenities", e.target.value.split(",").map(amenity => amenity.trim()).filter(Boolean))}
            placeholder={t("wifi, garden, kitchen")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">
              <TranslateText text="Latitude" />
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={item.latitude || ""}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || null)}
              placeholder={t("Ex: 35.8245")}
            />
          </div>
          <div>
            <Label htmlFor="longitude">
              <TranslateText text="Longitude" />
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={item.longitude || ""}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value) || null)}
              placeholder={t("Ex: 10.6447")}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="breakfast"
            checked={item.breakfast || false}
            onCheckedChange={(checked) => updateField("breakfast", checked)}
          />
          <Label htmlFor="breakfast">
            <TranslateText text="Breakfast included" />
          </Label>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="guesthouses"
          />
        </div>
      </>
    );
  };

  const renderAirportFields = (item: Partial<Airport>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              <TranslateText text="Name" /> *
            </Label>
            <Input
              id="name"
              value={item.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("Airport Name")}
            />
          </div>
          <div>
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={item.code || ""}
              onChange={(e) => updateField("code", e.target.value.toUpperCase())}
              placeholder={t("Ex: TUN")}
              maxLength={3}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">
              <TranslateText text="Location" /> *
            </Label>
            <Input
              id="location"
              value={item.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder={t("Location")}
            />
          </div>
          <div>
            <Label htmlFor="region">
              <TranslateText text="Region" />
            </Label>
            <Select value={item.region || ""} onValueChange={(value) => updateField("region", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select a region")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="North">
                  <TranslateText text="North" />
                </SelectItem>
                <SelectItem value="South">
                  <TranslateText text="South" />
                </SelectItem>
                <SelectItem value="Center">
                  <TranslateText text="Center" />
                </SelectItem>
                <SelectItem value="East">
                  <TranslateText text="East" />
                </SelectItem>
                <SelectItem value="West">
                  <TranslateText text="West" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description">
            <TranslateText text="Description" />
          </Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder={t("Description")}
            className="min-h-[100px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">
              <TranslateText text="Latitude" /> *
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={item.latitude || ""}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || null)}
              placeholder={t("Ex: 36.851033")}
            />
          </div>
          <div>
            <Label htmlFor="longitude">
              <TranslateText text="Longitude" /> *
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={item.longitude || ""}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value) || null)}
              placeholder={t("Ex: 10.227217")}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="advantages">
            <TranslateText text="Advantages (comma separated)" />
          </Label>
          <Input
            id="advantages"
            value={Array.isArray(item.advantages) ? item.advantages.join(", ") : ""}
            onChange={(e) => updateField("advantages", e.target.value.split(",").map(advantage => advantage.trim()).filter(Boolean))}
            placeholder={t("Advantages (comma separated)")}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={item.is_active !== false}
            onCheckedChange={(checked) => updateField("is_active", checked)}
          />
          <Label htmlFor="is_active">
            <TranslateText text="Active Airport" />
          </Label>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="airports"
          />
        </div>
      </>
    );
  };

  const renderPredefinedTripFields = (item: Partial<PredefinedTrip>, isEditing: boolean = false) => {
    const updateField = isEditing ? updateEditingField : updateNewItemField;

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              <TranslateText text="Trip Name" /> *
            </Label>
            <Input
              id="name"
              value={item.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("Ex: Aventure dans le Sud tunisien")}
            />
          </div>
          <div>
            <Label htmlFor="duration_days">
              <TranslateText text="Duration in days" /> *
            </Label>
            <Input
              id="duration_days"
              type="number"
              min="1"
              max="30"
              value={item.duration_days || ""}
              onChange={(e) => updateField("duration_days", parseInt(e.target.value) || 1)}
              placeholder={t("Ex: 7")}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">
            <TranslateText text="Description" />
          </Label>
          <Textarea
            id="description"
            value={item.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder={t("Description")}
            className="min-h-[100px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="target_airport_id">
              <TranslateText text="Destination Airport" />
            </Label>
            <Select value={item.target_airport_id || ""} onValueChange={(value) => updateField("target_airport_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select an airport")} />
              </SelectTrigger>
              <SelectContent>
                {airports.map((airport) => (
                  <SelectItem key={airport.id} value={airport.id}>
                    {airport.name} ({airport.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price_estimate">
              <TranslateText text="Estimated Price" />
            </Label>
            <Input
              id="price_estimate"
              value={item.price_estimate || ""}
              onChange={(e) => updateField("price_estimate", e.target.value)}
              placeholder={t("Ex: À partir de 1200€")}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="difficulty_level">
              <TranslateText text="Difficulty Level" />
            </Label>
            <Select value={item.difficulty_level || "medium"} onValueChange={(value) => updateField("difficulty_level", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select a level")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">
                  <TranslateText text="Easy" />
                </SelectItem>
                <SelectItem value="medium">
                  <TranslateText text="Medium" />
                </SelectItem>
                <SelectItem value="hard">
                  <TranslateText text="Hard" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="theme">
              <TranslateText text="Theme" />
            </Label>
            <Input
              id="theme"
              value={item.theme || ""}
              onChange={(e) => updateField("theme", e.target.value)}
              placeholder={t("Ex: Aventure, Culture, Détente")}
            />
          </div>
        </div>
        {/* Planning mode selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">
              <TranslateText text="Planning Mode" />
            </Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-detailed-planning"
                  checked={useDetailedPlanning}
                  onCheckedChange={(checked) => setUseDetailedPlanning(checked === true)}
                />
                <Label htmlFor="use-detailed-planning" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <TranslateText text="Detailed Timeline" />
                </Label>
              </div>
            </div>
          </div>

          {useDetailedPlanning ? (
            /* Detailed planning with timeline */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">
                  <TranslateText text="Detailed day-by-day planning" />
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newDay: DetailedDayPlan = {
                      day: detailedDays.length + 1,
                      title: `Day ${detailedDays.length + 1}`,
                      timeline: [],
                      accommodationType: 'none'
                    };
                    setDetailedDays(prev => [...prev, newDay]);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <TranslateText text="Add a day" />
                </Button>
              </div>

              {detailedDays.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <TranslateText text="No days planned" />
                </div>
              ) : (
                <div className="space-y-6">
                  {detailedDays.map((dayPlan, index) => (
                    <DayTimelineEditor
                      key={dayPlan.day}
                      dayPlan={dayPlan}
                      onUpdate={(updatedPlan) => {
                        const newDetailedDays = [...detailedDays];
                        newDetailedDays[index] = updatedPlan;
                        setDetailedDays(newDetailedDays);
                      }}
                      onRemove={() => {
                        const newDetailedDays = detailedDays.filter((_, i) => i !== index);
                        // Reorder days
                        const reorderedDays = newDetailedDays.map((day, i) => ({
                          ...day,
                          day: i + 1,
                          title: day.title.replace(/Jour \d+/, `Jour ${i + 1}`)
                        }));
                        setDetailedDays(reorderedDays);
                      }}
                      activities={activities}
                      hotels={hotels}
                      guestHouses={guestHouses}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Simple planning */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">
                  <TranslateText text="Simple day-by-day planning" />
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const nextDay = Object.keys(daySelections).length + 1;
                    setDaySelections(prev => ({
                      ...prev,
                      [nextDay]: { activities: [], accommodationId: '', accommodationType: 'none' }
                    }));
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <TranslateText text="Add a day" />
                </Button>
              </div>
              {Object.keys(daySelections).length > 0 && Object.keys(daySelections).sort((a, b) => parseInt(a) - parseInt(b)).map((dayKey) => {
                const day = parseInt(dayKey);
                const isLastDay = day === Object.keys(daySelections).length;
                const dayData = daySelections[day] || { activities: [], accommodationId: '', accommodationType: 'none' };

                return (
                  <div key={day} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-primary">
                        <TranslateText text="Day" /> {day}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSelections = { ...daySelections };
                          delete newSelections[day];

                          // Reorder days to fill gaps
                          const sortedDays = Object.keys(newSelections).sort((a, b) => parseInt(a) - parseInt(b));
                          const reorderedSelections: { [key: number]: any } = {};
                          sortedDays.forEach((oldDay, index) => {
                            reorderedSelections[index + 1] = newSelections[parseInt(oldDay)];
                          });

                          setDaySelections(reorderedSelections);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Activities selection - Multiple activities per day */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>
                          <TranslateText text="Day activities" /> *
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Show a select dialog to add activities
                            const firstAvailableActivity = activities.find(activity =>
                              !dayData.activities.includes(activity.id!)
                            );
                            if (firstAvailableActivity) {
                              addActivityToDay(day, firstAvailableActivity.id!);
                            }
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          <TranslateText text="Add Activity" />
                        </Button>
                      </div>

                      {dayData.activities.length === 0 ? (
                        <div className="text-sm text-muted-foreground border-2 border-dashed rounded p-4 text-center">
                          <TranslateText text="No activities scheduled" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {dayData.activities.map((activityId, activityIndex) => {
                            const activity = activities.find(a => a.id === activityId);
                            return (
                              <div key={activityIndex} className="flex items-center gap-2 p-2 border rounded">
                                <div className="flex-1">
                                  <Select
                                    value={activityId}
                                    onValueChange={(value) => {
                                      const newActivities = [...dayData.activities];
                                      newActivities[activityIndex] = value;
                                      setDaySelections(prev => ({
                                        ...prev,
                                        [day]: {
                                          ...prev[day],
                                          activities: newActivities
                                        }
                                      }));
                                    }}
                                  >
                                    <SelectTrigger className="text-sm">
                                      <SelectValue placeholder={t("Select an activity")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {activities.map((activity) => (
                                        <SelectItem key={activity.id} value={activity.id!}>
                                          {activity.title} - {activity.location}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeActivityFromDay(day, activityIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Accommodation selection */}
                    {!isLastDay && (
                      <div className="space-y-2">
                        <Label>
                          <TranslateText text="Night accommodation" />
                        </Label>

                        {/* Accommodation type selection */}
                        <Select
                          value={dayData.accommodationType}
                          onValueChange={(value) => updateDaySelection(day, 'accommodationType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("Accommodation type")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <TranslateText text="No accommodation" />
                            </SelectItem>
                            <SelectItem value="hotel">
                              <TranslateText text="Hotel" />
                            </SelectItem>
                            <SelectItem value="guesthouse">
                              <TranslateText text="Guest House" />
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Specific accommodation selection */}
                        {dayData.accommodationType && dayData.accommodationType !== 'none' && (
                          <Select
                            value={dayData.accommodationId}
                            onValueChange={(value) => updateDaySelection(day, 'accommodationId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t(`Select a ${dayData.accommodationType}`)} />
                            </SelectTrigger>
                            <SelectContent>
                              {(dayData.accommodationType === 'hotel' ? hotels : guestHouses).map((accommodation) => (
                                <SelectItem key={accommodation.id} value={accommodation.id!}>
                                  {accommodation.name} - {accommodation.location} (ID: {accommodation.id?.slice(0, 8)}...)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={item.is_featured || false}
              onCheckedChange={(checked) => updateField("is_featured", checked)}
            />
            <Label htmlFor="is_featured">
              <TranslateText text="Featured trip" />
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={item.is_active !== false}
              onCheckedChange={(checked) => updateField("is_active", checked)}
            />
            <Label htmlFor="is_active">
              <TranslateText text="Active trip" />
            </Label>
          </div>
        </div>
        <div>
          <Label>Images</Label>
          <MultiImageUploader
            currentImages={item.images || []}
            onImagesUploaded={(images) => updateField("images", images)}
            maxImages={5}
            folder="predefined-trips"
          />
        </div>
      </>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            <TranslateText text="Trip Management" />
          </h1>
          <p className="text-muted-foreground">
            <TranslateText text="Manage activities, hotels and guest houses" />
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="activities">
              <TranslateText text="Activities" />
            </TabsTrigger>
            <TabsTrigger value="hotels">
              <TranslateText text="Hotels" />
            </TabsTrigger>
            <TabsTrigger value="guesthouses">
              <TranslateText text="Guest Houses" />
            </TabsTrigger>
            <TabsTrigger value="airports">
              <TranslateText text="Airports" />
            </TabsTrigger>
            <TabsTrigger value="predefined-trips">
              <TranslateText text="Trips" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  <TranslateText text="Activities" />
                </CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  <TranslateText text="Add Activity" />
                </Button>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div>{t("Loading...")}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <TranslateText text="Title" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Location" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Price" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Rating" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Category" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Visibility" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Actions" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.title}</TableCell>
                          <TableCell>{activity.location}</TableCell>
                          <TableCell>{activity.price || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {renderRatingStars(activity.rating)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{activity.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {activity.show_in_travel && <Badge variant="outline" className="text-xs">{t("Travel")}</Badge>}
                              {activity.show_in_start_my_trip && <Badge variant="outline" className="text-xs">{t("Start Trip")}</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(activity)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(activity.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  <TranslateText text="Hotels" />
                </CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  <TranslateText text="Add Hotel" />
                </Button>
              </CardHeader>
              <CardContent>
                {hotelsLoading ? (
                  <div>{t("Loading...")}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <TranslateText text="Name" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Location" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Price/Night" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Rating" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Breakfast" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Actions" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hotels.map((hotel) => (
                        <TableRow key={hotel.id}>
                          <TableCell className="font-medium">{hotel.name}</TableCell>
                          <TableCell>{hotel.location}</TableCell>
                          <TableCell>{hotel.price_per_night || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {renderRatingStars(hotel.rating)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {hotel.breakfast ? (
                              <Badge variant="default">
                                <TranslateText text="Inclus" />
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <TranslateText text="Non inclus" />
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(hotel)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(hotel.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guesthouses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  <TranslateText text="Guest Houses" />
                </CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  <TranslateText text="Add Guest House" />
                </Button>
              </CardHeader>
              <CardContent>
                {guestHousesLoading ? (
                  <div>{t("Loading...")}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <TranslateText text="Name" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Location" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Price/Night" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Rating" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Breakfast" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Actions" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guestHouses.map((guestHouse) => (
                        <TableRow key={guestHouse.id}>
                          <TableCell className="font-medium">{guestHouse.name}</TableCell>
                          <TableCell>{guestHouse.location}</TableCell>
                          <TableCell>{guestHouse.price_per_night || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {renderRatingStars(guestHouse.rating)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {guestHouse.breakfast ? (
                              <Badge variant="default">
                                <TranslateText text="Inclus" />
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <TranslateText text="Non inclus" />
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(guestHouse)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(guestHouse.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="airports" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  <TranslateText text="Airports" />
                </CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  <TranslateText text="Add Airport" />
                </Button>
              </CardHeader>
              <CardContent>
                {airportsLoading ? (
                  <div>{t("Loading...")}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <TranslateText text="Name" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Code" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Location" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Region" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Status" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Actions" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {airports.map((airport) => (
                        <TableRow key={airport.id}>
                          <TableCell className="font-medium">{airport.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{airport.code}</Badge>
                          </TableCell>
                          <TableCell>{airport.location}</TableCell>
                          <TableCell>{airport.region || "N/A"}</TableCell>
                          <TableCell>
                            {airport.is_active ? (
                              <Badge variant="default">
                                <TranslateText text="Active" />
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <TranslateText text="Inactive" />
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(airport)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(airport.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predefined-trips" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  <TranslateText text="Trips" />
                </CardTitle>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  <TranslateText text="Add Trip" />
                </Button>
              </CardHeader>
              <CardContent>
                {tripsLoading ? (
                  <div>{t("Loading...")}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <TranslateText text="Name" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Duration" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Estimated Price" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Difficulty" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Status" />
                        </TableHead>
                        <TableHead>
                          <TranslateText text="Actions" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predefinedTrips.map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              {trip.name}
                              {trip.is_featured && (
                                <Badge variant="outline" className="text-xs w-fit mt-1">
                                  <TranslateText text="Featured" />
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{trip.duration_days} {t("days")}</TableCell>
                          <TableCell>{trip.price_estimate || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              <TranslateText text={trip.difficulty_level || "medium"} />
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {trip.is_active ? (
                              <Badge variant="default">
                                <TranslateText text="Active" />
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <TranslateText text="Inactive" />
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(trip)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDelete(trip.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentTab === "activities" ? t("Edit Activity") :
                  currentTab === "hotels" ? t("Edit Hotel") :
                    currentTab === "guesthouses" ? t("Edit Guest House") :
                      currentTab === "airports" ? t("Edit Airport") : t("Edit Trip")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editingItem && (
                <>
                  {currentTab === "activities" && renderActivityFields(editingItem as Activity, true)}
                  {currentTab === "hotels" && renderHotelFields(editingItem as Hotel, true)}
                  {currentTab === "guesthouses" && renderGuestHouseFields(editingItem as GuestHouse, true)}
                  {currentTab === "airports" && renderAirportFields(editingItem as Airport, true)}
                  {currentTab === "predefined-trips" && renderPredefinedTripFields(editingItem as PredefinedTrip, true)}
                </>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                <TranslateText text="Cancel" />
              </Button>
              <Button onClick={handleSaveEdit}>
                <TranslateText text="Save" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentTab === "activities" ? t("Add Activity") :
                  currentTab === "hotels" ? t("Add Hotel") :
                    currentTab === "guesthouses" ? t("Add Guest House") :
                      currentTab === "airports" ? t("Add Airport") : t("Add Trip")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {currentTab === "activities" && renderActivityFields(newItem as Activity)}
              {currentTab === "hotels" && renderHotelFields(newItem as Hotel)}
              {currentTab === "guesthouses" && renderGuestHouseFields(newItem as GuestHouse)}
              {currentTab === "airports" && renderAirportFields(newItem as Airport)}
              {currentTab === "predefined-trips" && renderPredefinedTripFields(newItem as PredefinedTrip)}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                <TranslateText text="Cancel" />
              </Button>
              <Button onClick={handleAddNewItem}>
                <TranslateText text="Ajouter" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <TranslateText text="Are you sure?" />
              </AlertDialogTitle>
              <AlertDialogDescription>
                <TranslateText text="This action cannot be undone. It will permanently delete this item." />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <TranslateText text="Cancel" />
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteItem}>
                <TranslateText text="Delete" />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTripPage;
