import React, { useMemo, useState } from 'react';
import { Save, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { useSiteContent } from '../content.context';
import { t } from '../content';
import {
  Locale,
  LocalizedText,
  LocalizedTextArray,
  ServiceCategoryContent,
  ServiceSubItem,
  SiteContent,
} from '../types';
import { cn } from '../lib/utils';

const LANGS: Locale[] = ['az', 'en', 'ru', 'tr'];
type HomeCapabilitiesTextField = 'badge' | 'title' | 'titleAccent' | 'description' | 'cta';

function copyLocalizedText(value: LocalizedText): LocalizedText {
  return {
    az: value.az,
    en: value.en,
    ru: value.ru,
    tr: value.tr,
  };
}

function copyLocalizedArray(value: LocalizedTextArray): LocalizedTextArray {
  return {
    az: [...value.az],
    en: [...value.en],
    ru: [...value.ru],
    tr: [...value.tr],
  };
}

function cloneContent(content: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent;
}

function cloneSubItem(item: ServiceSubItem): ServiceSubItem {
  return {
    ...item,
    name: copyLocalizedText(item.name),
    desc: copyLocalizedText(item.desc),
    questions: copyLocalizedArray(item.questions),
  };
}

function cloneCategory(category: ServiceCategoryContent): ServiceCategoryContent {
  return {
    ...category,
    title: copyLocalizedText(category.title),
    description: copyLocalizedText(category.description),
    subItems: category.subItems.map(cloneSubItem),
  };
}

function buildTextUpdater(locale: Locale) {
  return (target: LocalizedText, value: string): LocalizedText => ({
    ...target,
    [locale]: value,
  });
}

function buildTextArrayUpdater(locale: Locale) {
  return (target: LocalizedTextArray, value: string): LocalizedTextArray => ({
    ...target,
    [locale]: value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  });
}

interface ContentStudioProps {
  className?: string;
}

export default function ContentStudio({ className }: ContentStudioProps) {
  const { content, setContent, locale, reloadContent } = useSiteContent();
  const [editorLocale, setEditorLocale] = useState<Locale>(locale);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(content.services.categories[0]?.id || '');
  const selectedCategory = useMemo(
    () => content.services.categories.find((category) => category.id === selectedCategoryId) || null,
    [content.services.categories, selectedCategoryId],
  );

  const updateContent = (updater: (current: SiteContent) => SiteContent) => {
    setContent((prev) => updater(cloneContent(prev)));
  };

  const updateHero = (field: keyof SiteContent['home']['hero'], value: string) => {
    const setText = buildTextUpdater(editorLocale);
    updateContent((next) => {
      const current = next.home.hero[field] as LocalizedText;
      next.home.hero[field] = setText(current, value) as SiteContent['home']['hero'][typeof field];
      return next;
    });
  };

  const updateCapabilities = (field: HomeCapabilitiesTextField, value: string) => {
    const setText = buildTextUpdater(editorLocale);
    updateContent((next) => {
      next.home.capabilities[field] = setText(next.home.capabilities[field], value);
      return next;
    });
  };

  const updateFinalCtaText = (field: keyof Omit<SiteContent['home']['finalCta'], 'email' | 'phone'>, value: string) => {
    const setText = buildTextUpdater(editorLocale);
    updateContent((next) => {
      const current = next.home.finalCta[field] as LocalizedText;
      next.home.finalCta[field] = setText(current, value) as SiteContent['home']['finalCta'][typeof field];
      return next;
    });
  };

  const updateFinalCtaContact = (field: 'email' | 'phone', value: string) => {
    updateContent((next) => {
      next.home.finalCta[field] = value;
      return next;
    });
  };

  const updateServiceCategory = (categoryId: string, field: 'title' | 'description', value: string) => {
    const setText = buildTextUpdater(editorLocale);
    updateContent((next) => {
      const category = next.services.categories.find((item) => item.id === categoryId);
      if (!category) return next;
      category[field] = setText(category[field], value);
      return next;
    });
  };

  const updateServiceSubItem = (categoryId: string, subItemId: string, field: 'name' | 'desc' | 'questions', value: string) => {
    const setText = buildTextUpdater(editorLocale);
    const setArray = buildTextArrayUpdater(editorLocale);

    updateContent((next) => {
      const category = next.services.categories.find((item) => item.id === categoryId);
      if (!category) return next;
      const subItem = category.subItems.find((item) => item.id === subItemId);
      if (!subItem) return next;

      if (field === 'questions') {
        subItem.questions = setArray(subItem.questions, value);
      } else {
        subItem[field] = setText(subItem[field], value);
      }

      return next;
    });
  };

  const addSubItem = (categoryId: string) => {
    updateContent((next) => {
      const category = next.services.categories.find((item) => item.id === categoryId);
      if (!category) return next;

      const id = `item-${Date.now()}`;
      const newSubItem: ServiceSubItem = {
        id,
        name: {
          az: 'Yeni alt xidmət',
          en: 'New sub service',
          ru: 'Новая подуслуга',
          tr: 'Yeni alt hizmet',
        },
        desc: {
          az: 'Təsviri daxil edin',
          en: 'Enter description',
          ru: 'Введите описание',
          tr: 'Açıklama girin',
        },
        questions: {
          az: ['Parametr 1'],
          en: ['Parameter 1'],
          ru: ['Параметр 1'],
          tr: ['Parametre 1'],
        },
      };

      category.subItems.push(newSubItem);
      return next;
    });
  };

  const removeSubItem = (categoryId: string, subItemId: string) => {
    updateContent((next) => {
      const category = next.services.categories.find((item) => item.id === categoryId);
      if (!category) return next;
      if (category.subItems.length <= 1) return next;
      category.subItems = category.subItems.filter((item) => item.id !== subItemId);
      return next;
    });
  };

  const addCategory = () => {
    updateContent((next) => {
      const id = `category-${Date.now()}`;
      const category: ServiceCategoryContent = {
        id,
        path: `/services/${id}`,
        title: {
          az: 'Yeni kateqoriya',
          en: 'New category',
          ru: 'Новая категория',
          tr: 'Yeni kategori',
        },
        description: {
          az: 'Kateqoriya təsviri',
          en: 'Category description',
          ru: 'Описание категории',
          tr: 'Kategori açıklaması',
        },
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1920&auto=format&fit=crop',
        subItems: [
          {
            id: `item-${Date.now()}`,
            name: {
              az: 'Alt xidmət',
              en: 'Sub service',
              ru: 'Подуслуга',
              tr: 'Alt hizmet',
            },
            desc: {
              az: 'Qısa təsvir',
              en: 'Short description',
              ru: 'Краткое описание',
              tr: 'Kısa açıklama',
            },
            questions: {
              az: ['Sual 1'],
              en: ['Question 1'],
              ru: ['Вопрос 1'],
              tr: ['Soru 1'],
            },
          },
        ],
      };

      next.services.categories.push(category);
      setSelectedCategoryId(id);
      return next;
    });
  };

  const removeCategory = (categoryId: string) => {
    updateContent((next) => {
      if (next.services.categories.length <= 1) return next;
      next.services.categories = next.services.categories.filter((category) => category.id !== categoryId);
      const fallback = next.services.categories[0]?.id || '';
      setSelectedCategoryId(fallback);
      return next;
    });
  };

  const saveContent = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        setSaveMessage('Yadda saxlanma zamanı xəta baş verdi.');
        return;
      }

      setSaveMessage('Məzmun uğurla yadda saxlandı.');
    } catch {
      setSaveMessage('Serverə qoşulma alınmadı.');
    } finally {
      setIsSaving(false);
    }
  };

  const reloadFromFile = async () => {
    await reloadContent();
    setSaveMessage('Fayldan son versiya yeniləndi.');
  };

  const currentQuestions = (subItem: ServiceSubItem) => subItem.questions[editorLocale].join('\n');

  return (
    <section className={cn('space-y-8', className)}>
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-black/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Content Studio</h2>
            <p className="text-sm text-gray-500 mt-1">Homepage və xidmət məzmununu AZ/EN/RU/TR dillərində redaktə edin.</p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1 border border-gray-100">
            {LANGS.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setEditorLocale(lang)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all',
                  editorLocale === lang ? 'bg-black text-white' : 'text-gray-500 hover:text-black',
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            onClick={saveContent}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-widest disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Content'}
          </button>

          <button
            type="button"
            onClick={reloadFromFile}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-black"
          >
            <RefreshCw className="w-4 h-4" /> Reload
          </button>

          {saveMessage && <p className="text-xs font-bold text-gray-500 self-center">{saveMessage}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-5 shadow-xl shadow-black/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Home Hero</h3>
          <input
            value={content.home.hero.titleLine1[editorLocale]}
            onChange={(event) => updateHero('titleLine1', event.target.value)}
            placeholder="Title line 1"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
          />
          <input
            value={content.home.hero.titleLine2[editorLocale]}
            onChange={(event) => updateHero('titleLine2', event.target.value)}
            placeholder="Title line 2"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
          />
          <input
            value={content.home.hero.titleLine3[editorLocale]}
            onChange={(event) => updateHero('titleLine3', event.target.value)}
            placeholder="Title line 3"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
          />
          <textarea
            rows={3}
            value={content.home.hero.subtitle[editorLocale]}
            onChange={(event) => updateHero('subtitle', event.target.value)}
            placeholder="Hero subtitle"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm resize-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={content.home.hero.primaryCta[editorLocale]}
              onChange={(event) => updateHero('primaryCta', event.target.value)}
              placeholder="Primary CTA"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
            <input
              value={content.home.hero.secondaryCta[editorLocale]}
              onChange={(event) => updateHero('secondaryCta', event.target.value)}
              placeholder="Secondary CTA"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-5 shadow-xl shadow-black/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Home Capabilities</h3>
          <input
            value={content.home.capabilities.badge[editorLocale]}
            onChange={(event) => updateCapabilities('badge', event.target.value)}
            placeholder="Badge"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={content.home.capabilities.title[editorLocale]}
              onChange={(event) => updateCapabilities('title', event.target.value)}
              placeholder="Title"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
            <input
              value={content.home.capabilities.titleAccent[editorLocale]}
              onChange={(event) => updateCapabilities('titleAccent', event.target.value)}
              placeholder="Title accent"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
          </div>
          <textarea
            rows={3}
            value={content.home.capabilities.description[editorLocale]}
            onChange={(event) => updateCapabilities('description', event.target.value)}
            placeholder="Description"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm resize-none"
          />
          <input
            value={content.home.capabilities.cta[editorLocale]}
            onChange={(event) => updateCapabilities('cta', event.target.value)}
            placeholder="CTA"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-5 shadow-xl shadow-black/5 xl:col-span-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Home Final CTA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={content.home.finalCta.title[editorLocale]}
              onChange={(event) => updateFinalCtaText('title', event.target.value)}
              placeholder="Final title"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
            <input
              value={content.home.finalCta.titleAccent[editorLocale]}
              onChange={(event) => updateFinalCtaText('titleAccent', event.target.value)}
              placeholder="Final title accent"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
          </div>
          <textarea
            rows={3}
            value={content.home.finalCta.description[editorLocale]}
            onChange={(event) => updateFinalCtaText('description', event.target.value)}
            placeholder="Final CTA description"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm resize-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={content.home.finalCta.primaryCta[editorLocale]}
              onChange={(event) => updateFinalCtaText('primaryCta', event.target.value)}
              placeholder="Primary CTA"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
            <input
              value={content.home.finalCta.secondaryCta[editorLocale]}
              onChange={(event) => updateFinalCtaText('secondaryCta', event.target.value)}
              placeholder="Secondary CTA"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={content.home.finalCta.email}
              onChange={(event) => updateFinalCtaContact('email', event.target.value)}
              placeholder="Contact email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
            <input
              value={content.home.finalCta.phone}
              onChange={(event) => updateFinalCtaContact('phone', event.target.value)}
              placeholder="Contact phone"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />
          </div>
          <input
            value={content.home.finalCta.address[editorLocale]}
            onChange={(event) => updateFinalCtaText('address', event.target.value)}
            placeholder="Address"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-black/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Service Categories & Sub Services</h3>
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {content.services.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategoryId(category.id)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border',
                selectedCategoryId === category.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:text-black',
              )}
            >
              {t(editorLocale, category.title)}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={selectedCategory.title[editorLocale]}
                onChange={(event) => updateServiceCategory(selectedCategory.id, 'title', event.target.value)}
                placeholder="Category title"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
              />
              <div className="flex gap-2">
                <input
                  value={selectedCategory.path}
                  onChange={(event) => {
                    const pathValue = event.target.value;
                    updateContent((next) => {
                      const target = next.services.categories.find((item) => item.id === selectedCategory.id);
                      if (!target) return next;
                      target.path = pathValue;
                      return next;
                    });
                  }}
                  placeholder="/services/category"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(selectedCategory.id)}
                  className="px-4 rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
                  title="Remove category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={selectedCategory.description[editorLocale]}
              onChange={(event) => updateServiceCategory(selectedCategory.id, 'description', event.target.value)}
              placeholder="Category description"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm resize-none"
            />

            <input
              value={selectedCategory.image}
              onChange={(event) => {
                const imageValue = event.target.value;
                updateContent((next) => {
                  const target = next.services.categories.find((item) => item.id === selectedCategory.id);
                  if (!target) return next;
                  target.image = imageValue;
                  return next;
                });
              }}
              placeholder="Category image URL"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
            />

            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">Sub Items</h4>
                <button
                  type="button"
                  onClick={() => addSubItem(selectedCategory.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black"
                >
                  <Plus className="w-4 h-4" /> Add Sub Item
                </button>
              </div>

              <div className="space-y-4">
                {selectedCategory.subItems.map((subItem) => (
                  <div key={subItem.id} className="border border-gray-100 rounded-2xl p-4 md:p-5 space-y-3 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row gap-3">
                      <input
                        value={subItem.name[editorLocale]}
                        onChange={(event) =>
                          updateServiceSubItem(selectedCategory.id, subItem.id, 'name', event.target.value)
                        }
                        placeholder="Sub item name"
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          value={subItem.id}
                          onChange={(event) => {
                            const idValue = event.target.value;
                            updateContent((next) => {
                              const category = next.services.categories.find((item) => item.id === selectedCategory.id);
                              if (!category) return next;
                              const target = category.subItems.find((item) => item.id === subItem.id);
                              if (!target) return next;
                              target.id = idValue;
                              return next;
                            });
                          }}
                          placeholder="ID"
                          className="w-48 px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeSubItem(selectedCategory.id, subItem.id)}
                          className="px-4 rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
                          title="Remove sub item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={subItem.desc[editorLocale]}
                      onChange={(event) =>
                        updateServiceSubItem(selectedCategory.id, subItem.id, 'desc', event.target.value)
                      }
                      placeholder="Sub item description"
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm resize-none"
                    />

                    <textarea
                      rows={4}
                      value={currentQuestions(subItem)}
                      onChange={(event) =>
                        updateServiceSubItem(selectedCategory.id, subItem.id, 'questions', event.target.value)
                      }
                      placeholder="One question per line"
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
