function CategoryOption({
  icon,
  title,
  description,
  isSelected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border bg-white px-5 py-4 text-left ${
        isSelected
          ? 'border-[#8B00F5]'
          : 'border-[#E9E2F5] hover:border-[#CDB5F5]'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>

        <div>
          <h3 className="text-sm font-bold text-[#292238]">{title}</h3>
          <p className="mt-1 text-xs text-[#837A9E]">{description}</p>
        </div>
      </div>

      <span
        className={`h-5 w-5 rounded-full border-2 ${
          isSelected
            ? 'border-[#8B00F5] bg-[#8B00F5] shadow-[inset_0_0_0_4px_white]'
            : 'border-[#D8D0E8]'
        }`}
      />
    </button>
  )
}

export default CategoryOption