import type { Module } from '@/@types/module';
import { cn } from '@/app/utils/cn';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ModuleCard } from '@/features/module/components/module-card';
import React, { useEffect, useState } from 'react';

type DashboardCarouselProps = {
  modules: Module[];
  extraCard: React.ReactNode;
};

export const DashboardCarousel = ({
  modules,
  extraCard,
}: DashboardCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      opts={{
        align: 'center',
        containScroll: false,
        loop: true,
      }}
      setApi={setApi}
      className="w-full"
    >
      <CarouselContent>
        {modules.map((module, index) => (
          <CarouselItem
            key={module.id}
            className="basis-[85%] md:basis-[60%] lg:basis-[50%] 2xl:basis-[40%]"
          >
            <div
              className={cn(
                'h-full transition-all duration-500 ease-in-out',
                current === index
                  ? 'scale-100 opacity-100'
                  : 'scale-[0.97] opacity-40',
              )}
            >
              <ModuleCard {...module} isDraft={false} />
            </div>
          </CarouselItem>
        ))}
        <CarouselItem className="basis-[85%] md:basis-[60%] lg:basis-[50%] 2xl:basis-[40%]">
          <div
            className={cn(
              'h-full transition-all duration-500 ease-in-out',
              current === modules.length
                ? 'scale-100 opacity-100'
                : 'scale-[0.97] opacity-40',
            )}
          >
            {extraCard}
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};
