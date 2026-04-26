'use client'

type Props = {
  statement: string
  onAnswer: (answer: boolean) => void
}

export default function QuizCard({ statement, onAnswer }: Props) {
  return (
    <div className="rounded-2xl bg-card border border-white/10 p-8 flex flex-col gap-8">
      <p
        id="quiz-statement"
        className="text-xl md:text-2xl text-slate-100 leading-relaxed font-medium text-center"
      >
        {statement}
      </p>
      <div
        role="group"
        aria-labelledby="quiz-statement"
        className="flex gap-4 justify-center"
      >
        <button
          onClick={() => onAnswer(true)}
          className="flex-1 max-w-[180px] py-4 rounded-xl bg-accent hover:bg-accent-light active:scale-95 transition-all font-semibold text-white text-lg focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        >
          Verdadeiro
        </button>
        <button
          onClick={() => onAnswer(false)}
          className="flex-1 max-w-[180px] py-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-semibold text-white text-lg focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        >
          Falso
        </button>
      </div>
    </div>
  )
}
