import { animate, motion, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

export default function PillarCard({ pillar }: { pillar: any }) {
  const percentRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // margin apenas na parte inferior garante que vai disparar bem no mobile
  const isInView = useInView(containerRef, {
    once: true,
    margin: '0px 0px -20px 0px',
  });

  useEffect(() => {
    if (isInView) {
      // Anima o número de 0 até a porcentagem do pilar
      const controls = animate(0, pillar.percentage, {
        duration: 1.5,
        ease: 'easeOut',
        onUpdate(value) {
          if (percentRef.current) {
            percentRef.current.textContent = `${Math.round(value)}%`;
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, pillar.percentage]);

  return (
    <div
      ref={containerRef}
      className="group rounded-3xl border border-slate-100 bg-white/60 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-md transition-all hover:shadow-xl"
    >
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-inner transition-transform group-hover:rotate-6 ${pillar.color}`}
          >
            <pillar.icon className="h-7 w-7" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-900">{pillar.name}</h4>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm">
                {pillar.level}
              </span>
            </div>
          </div>
        </div>

        {/* Span referenciado para a animação numérica */}
        <span
          ref={percentRef}
          className="from-primary to-destructive bg-linear-to-r bg-clip-text text-4xl font-black text-transparent"
        >
          0%
        </span>
      </div>

      {/* Gráfico de Barra Animado crescendo junto */}
      <div className="h-6 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          // Ao invés de whileInView, usamos a propriedade animate vinculada à variável isInView
          animate={{ width: isInView ? `${pillar.percentage}%` : '0%' }}
          transition={{
            duration: 1.5, // Duração igual à do contador numérico
            ease: 'easeOut',
          }}
          className={`h-full rounded-full ${pillar.color}`}
        />
      </div>
    </div>
  );
}
