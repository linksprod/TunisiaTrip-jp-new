import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Clock, MapPin, Car, Camera } from 'lucide-react';
import MultiImageUploader from '@/components/admin/MultiImageUploader';
import { TimelineActivity, DetailedDayPlan } from '@/types/predefinedTripTypes';
import { useTranslation } from '@/hooks/use-translation';
import { TranslateText } from '@/components/translation/TranslateText';

interface DayTimelineEditorProps {
  dayPlan: DetailedDayPlan;
  onUpdate: (updatedPlan: DetailedDayPlan) => void;
  onRemove: () => void;
  activities: any[];
  hotels: any[];
  guestHouses: any[];
}

const activityTypes = [
  { value: 'breakfast', label: 'Petit-déjeuner', icon: '🍳' },
  { value: 'activity', label: 'Activité', icon: '🎯' },
  { value: 'lunch', label: 'Déjeuner', icon: '🍽️' },
  { value: 'dinner', label: 'Dîner', icon: '🍷' },
  { value: 'departure', label: 'Départ', icon: '✈️' },
  { value: 'arrival', label: 'Arrivée', icon: '🏨' },
  { value: 'free-time', label: 'Temps libre', icon: '🌅' },
  { value: 'custom', label: 'Personnalisé', icon: '⭐' },
];

export const DayTimelineEditor: React.FC<DayTimelineEditorProps> = ({
  dayPlan,
  onUpdate,
  onRemove,
  activities,
  hotels,
  guestHouses
}) => {
  const { currentLanguage, t } = useTranslation();
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const addTimelineActivity = () => {
    const newActivity: TimelineActivity = {
      id: `timeline-${Date.now()}`,
      time: '09:00',
      activity: '',
      location: '',
      duration: '1h',
      type: 'activity',
      images: []
    };

    onUpdate({
      ...dayPlan,
      timeline: [...dayPlan.timeline, newActivity]
    });
  };

  const updateTimelineActivity = (activityId: string, field: keyof TimelineActivity, value: any) => {
    const updatedTimeline = dayPlan.timeline.map(item =>
      item.id === activityId ? { ...item, [field]: value } : item
    );

    onUpdate({
      ...dayPlan,
      timeline: updatedTimeline
    });
  };

  const removeTimelineActivity = (activityId: string) => {
    const updatedTimeline = dayPlan.timeline.filter(item => item.id !== activityId);
    onUpdate({
      ...dayPlan,
      timeline: updatedTimeline
    });
  };

  const updateDayField = (field: keyof DetailedDayPlan, value: any) => {
    onUpdate({
      ...dayPlan,
      [field]: value
    });
  };

  const sortedTimeline = [...dayPlan.timeline].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl">{t("Day")} {dayPlan.day}</CardTitle>
            <Input
              value={dayPlan.title}
              onChange={(e) => updateDayField('title', e.target.value)}
              placeholder={t("Titre du jour")}
              className="max-w-xs"
            />
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description du jour */}
        <div>
          <Label htmlFor={`day-${dayPlan.day}-description`}>{t("Description")}</Label>
          <Textarea
            id={`day-${dayPlan.day}-description`}
            value={dayPlan.description || ''}
            onChange={(e) => updateDayField('description', e.target.value)}
            placeholder={t("Description de la journée...")}
            className="min-h-[80px]"
          />
        </div>

        {/* Activité principale */}
        <div>
          <Label htmlFor={`day-${dayPlan.day}-main-activity`}>{t("Activité principale du jour")}</Label>
          <Select
            value={dayPlan.mainActivityId || ''}
            onValueChange={(value) => updateDayField('mainActivityId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Sélectionner l'activité principale")} />
            </SelectTrigger>
            <SelectContent>
              {activities.map((activity) => (
                <SelectItem key={activity.id} value={activity.id}>
                  {activity.title} - {activity.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <TranslateText text="Programme de la journée" language={currentLanguage} />
            </Label>
            <Button onClick={addTimelineActivity} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t("Ajouter une activité")}
            </Button>
          </div>

          {sortedTimeline.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              {t("Aucune activité programmée. Cliquez sur \"Ajouter une activité\" pour commencer.")}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTimeline.map((timelineItem, index) => {
                const activityType = activityTypes.find(type => type.value === timelineItem.type);
                const isExpanded = expandedActivity === timelineItem.id;

                return (
                  <Card key={timelineItem.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            {activityType?.icon || '⭐'}
                          </div>
                          {index < sortedTimeline.length - 1 && (
                            <div className="w-0.5 h-8 bg-border mt-2" />
                          )}
                        </div>

                        {/* Activity content */}
                        <div className="flex-1 space-y-3">
                          {/* Basic info row */}
                          <div className="grid grid-cols-6 gap-3 items-center">
                            <Input
                              type="time"
                              value={timelineItem.time}
                              onChange={(e) => updateTimelineActivity(timelineItem.id, 'time', e.target.value)}
                              className="text-sm"
                            />
                            <Select
                              value={timelineItem.type}
                              onValueChange={(value) => updateTimelineActivity(timelineItem.id, 'type', value)}
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {activityTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.icon} {t(type.label)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              value={timelineItem.activity}
                              onChange={(e) => updateTimelineActivity(timelineItem.id, 'activity', e.target.value)}
                              placeholder={t("Nom de l'activité")}
                              className="text-sm"
                            />
                            <Input
                              value={timelineItem.location}
                              onChange={(e) => updateTimelineActivity(timelineItem.id, 'location', e.target.value)}
                              placeholder={t("Lieu")}
                              className="text-sm"
                            />
                            <Input
                              value={timelineItem.duration}
                              onChange={(e) => updateTimelineActivity(timelineItem.id, 'duration', e.target.value)}
                              placeholder={t("Durée")}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedActivity(isExpanded ? null : timelineItem.id)}
                              >
                                <Camera className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimelineActivity(timelineItem.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Expanded details */}
                          {isExpanded && (
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                              <div>
                                <Label className="text-sm">{t("Description")}</Label>
                                <Textarea
                                  value={timelineItem.description || ''}
                                  onChange={(e) => updateTimelineActivity(timelineItem.id, 'description', e.target.value)}
                                  placeholder={t("Description détaillée...")}
                                  className="min-h-[60px] text-sm"
                                />
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-sm flex items-center gap-1">
                                    <Car className="h-3 w-3" />
                                    {t("Transport")}
                                  </Label>
                                  <Input
                                    value={timelineItem.transport || ''}
                                    onChange={(e) => updateTimelineActivity(timelineItem.id, 'transport', e.target.value)}
                                    placeholder={t("Ex: À pied, en bus...")}
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {t("Distance")}
                                  </Label>
                                  <Input
                                    value={timelineItem.distance || ''}
                                    onChange={(e) => updateTimelineActivity(timelineItem.id, 'distance', e.target.value)}
                                    placeholder={t("Ex: 5 km, 30 min")}
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                              <div className="col-span-2">
                                <Label className="text-sm">{t("Images de l'activité")}</Label>
                                <MultiImageUploader
                                  currentImages={timelineItem.images}
                                  onImagesUploaded={(images) => updateTimelineActivity(timelineItem.id, 'images', images)}
                                  maxImages={3}
                                  folder={`timeline/${timelineItem.id}`}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Hébergement */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{t("Type d'hébergement")}</Label>
            <Select
              value={dayPlan.accommodationType}
              onValueChange={(value) => updateDayField('accommodationType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("Aucun hébergement")}</SelectItem>
                <SelectItem value="hotel">{t("Hôtel")}</SelectItem>
                <SelectItem value="guesthouse">{t("Maison d'hôte")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {dayPlan.accommodationType !== 'none' && (
            <div>
              <Label>{t("Hébergement spécifique")}</Label>
              <Select
                value={dayPlan.accommodationId || ''}
                onValueChange={(value) => updateDayField('accommodationId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t(`Sélectionner ${dayPlan.accommodationType === 'hotel' ? 'un hôtel' : 'une maison d\'hôte'}`)} />
                </SelectTrigger>
                <SelectContent>
                  {(dayPlan.accommodationType === 'hotel' ? hotels : guestHouses).map((accommodation) => (
                    <SelectItem key={accommodation.id} value={accommodation.id}>
                      {accommodation.name} - {accommodation.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};