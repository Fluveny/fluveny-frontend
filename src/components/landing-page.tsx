import { Button } from '@/components/ui/button';
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  GitGraph,
  Headphones,
  Mic,
  PenTool,
} from 'lucide-react';

import { motion } from 'motion/react';
import { Link } from 'react-router';
import PillarCard from './pillar-section';

export default function LandingPage() {
  const pillars = [
    {
      name: 'Reading',
      icon: BookOpen,
      level: 'Avançado',
      percentage: 85,
      color: 'bg-primary',
    },
    {
      name: 'Listening',
      icon: Headphones,
      level: 'Intermediário',
      percentage: 70,
      color: 'bg-primary/80',
    },
    {
      name: 'Writing',
      icon: PenTool,
      level: 'Avançado',
      percentage: 80,
      color: 'bg-destructive/80',
    },
    {
      name: 'Speaking',
      icon: Mic,
      level: 'Iniciante',
      percentage: 40,
      color: 'bg-destructive',
    },
  ];

  const grammarRules = [
    'Syntax',
    'Verbs',
    'Nouns',
    'Adjectives',
    'Pronouns',
    'Adverbs',
    'Prepositions',
    'Fluency',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden scroll-smooth bg-white font-sans">
      {/* BOLAS DE BLUR ANIMADAS NO BACKGROUND (Otimizadas para GPU) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white/50">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-primary/20 absolute -top-40 -left-40 h-[600px] w-[600px] transform-gpu rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-destructive/20 absolute top-40 -right-40 h-[600px] w-[600px] transform-gpu rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-primary/20 absolute -bottom-40 left-1/3 h-[700px] w-[700px] -translate-x-1/2 transform-gpu rounded-full blur-[128px]"
        />
      </div>

      {/* 1. HERO SECTION & ANIMAÇÃO DO CÉREBRO */}
      <section className="relative z-10 flex w-full flex-col items-center px-6 py-32 text-center md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto w-full max-w-5xl"
        >
          <h1 className="from-primary to-destructive mb-6 bg-linear-to-r bg-clip-text pb-2 text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl">
            Domine idiomas com a Fluveny
          </h1>
          <p className="mx-auto mb-16 max-w-3xl text-lg text-slate-600 md:text-xl">
            Uma plataforma colaborativa desenvolvida por{' '}
            <strong className="text-slate-800">
              alunos e professores de Letras
            </strong>
            . Pratique, evolua e conquiste a fluência com conteúdos estruturados
            por especialistas em linguística.
          </p>
        </motion.div>

        {/* Animação: Grammar Rules -> Brain */}
        <div className="relative flex h-96 w-full max-w-2xl items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0px 0px 0px rgba(0,0,0,0)',
                '0px 0px 40px rgba(var(--primary), 0.2)',
                '0px 0px 0px rgba(0,0,0,0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-slate-100 bg-white/80 shadow-2xl backdrop-blur-sm"
          >
            <Brain className="text-primary h-12 w-12" />
          </motion.div>

          {grammarRules.map((rule, index) => {
            const angle = (index / grammarRules.length) * Math.PI * 2;
            const radius = 250;
            const startX = Math.cos(angle) * radius;
            const startY = Math.sin(angle) * radius;

            return (
              <motion.div
                key={rule}
                initial={{ x: startX, y: startY, opacity: 0, scale: 0.5 }}
                animate={{
                  x: [startX, 0],
                  y: [startY, 0],
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: 'easeInOut',
                }}
                className="absolute rounded-full border border-slate-100 bg-white/90 px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-slate-700 shadow-lg backdrop-blur-md"
              >
                {rule}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 2. LINHA DO TEMPO (COMO FUNCIONA) */}
      <section className="relative z-10 w-full px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mb-24 text-center text-4xl font-extrabold text-slate-900 md:text-5xl"
          >
            Sua jornada de aprendizado
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-12"
          >
            <div className="from-primary via-primary/50 to-destructive absolute top-12 left-1/6 z-0 hidden h-1.5 w-2/3 -translate-y-1/2 rounded-full bg-linear-to-r opacity-30 md:block" />

            <motion.div
              variants={itemVariants}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="bg-primary text-primary-foreground shadow-primary/30 mb-8 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl ring-8 ring-white transition-transform hover:scale-110">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                1. Faça exercícios
              </h3>
              <p className="max-w-sm leading-relaxed text-slate-600">
                Pratique com módulos cuidadosamente criados e validados por
                docentes e discentes de Letras.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="from-primary to-destructive shadow-primary/30 mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-r text-white shadow-2xl ring-8 ring-white transition-transform hover:scale-110">
                <Activity className="h-10 w-10" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                2. Analise seu desempenho
              </h3>
              <p className="max-w-sm leading-relaxed text-slate-600">
                Acompanhe sua evolução em tempo real e identifique rapidamente
                seus pontos de melhoria.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="bg-destructive text-destructive-foreground shadow-destructive/30 mb-8 flex h-24 w-24 items-center justify-center rounded-full text-white shadow-2xl ring-8 ring-white transition-transform hover:scale-110">
                <Award className="h-10 w-10" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                3. Receba recompensas
              </h3>
              <p className="max-w-sm leading-relaxed text-slate-600">
                Mantenha a motivação em alta com conquistas, badges e
                reconhecimento pelo seu esforço.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. OS 4 PILARES DO IDIOMA */}
      <section className="relative z-10 w-full px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-extrabold text-slate-900 md:text-5xl">
              Treine os 4 Pilares
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Acompanhe seu nível de domínio em cada aspecto fundamental do
              idioma.
            </p>
          </div>

          <div className="space-y-6">
            {pillars.map((pillar) => (
              <PillarCard key={pillar.name} pillar={pillar} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION (CTA) */}
      <section className="relative z-10 flex w-full flex-col items-center px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <h2 className="mb-6 text-4xl font-extrabold text-slate-900 md:text-5xl">
            Pronto para transformar sua fluência?
          </h2>
          <p className="mb-10 max-w-2xl text-xl leading-relaxed text-slate-600">
            Junte-se a estudantes de todo o Brasil e comece a aprender de forma
            inteligente, validada e totalmente gratuita.
          </p>
          <Button
            asChild
            size="lg"
            className="group from-primary to-destructive shadow-primary/20 hover:shadow-destructive/30 rounded-full border-0 bg-linear-to-r px-10 py-8 text-xl font-bold shadow-2xl transition-all hover:scale-105"
          >
            <Link to="/register" className="flex items-center gap-3">
              Aprender de Graça
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-6 w-6" />
              </motion.div>
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* 5. FOOTER / SOBRE NÓS */}
      <footer className="relative z-10 w-full bg-white px-6 py-16 text-slate-600 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-12 lg:flex-row">
          <div className="max-w-2xl">
            <h4 className="mb-6 text-3xl font-bold text-slate-900">
              Sobre o Projeto Fluveny
            </h4>
            <p className="mb-4 text-lg leading-relaxed text-slate-600">
              O Fluveny é um programa de extensão vinculado à{' '}
              <strong className="text-primary">
                Universidade Federal de Alfenas (UNIFAL)
              </strong>
              . Nossa missão é democratizar o ensino de idiomas aliando
              tecnologia open-source aos melhores métodos pedagógicos, sendo
              totalmente conduzido, testado e construído por alunos e
              professores do curso de Letras.
            </p>
            <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Desenvolvido com orgulho pela comunidade acadêmica.
            </p>
          </div>

          <div className="flex w-full flex-col items-start rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm lg:w-auto lg:items-end">
            <h5 className="mb-3 text-xl font-bold text-slate-900">
              Produto Open Source 🌎
            </h5>
            <p className="mb-6 text-base text-slate-600 lg:text-right">
              Acredita na democratização do ensino? <br />
              Sinta-se livre para contribuir com nosso código!
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm transition-transform hover:-translate-y-1 hover:bg-slate-50 lg:w-auto"
            >
              <a
                href="https://github.com/Fluveny/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 font-semibold"
              >
                <GitGraph className="h-5 w-5" />
                Acessar o GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-center gap-4 border-t border-slate-100 pt-8 text-center text-sm font-medium md:flex-row">
          <p>
            © {new Date().getFullYear()} Fluveny. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
