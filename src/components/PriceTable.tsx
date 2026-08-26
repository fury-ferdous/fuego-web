import { karaokeRooms, priceColumns } from "@/lib/content";

/** Preise pro Raum. Quelle ist ausschliesslich lib/content.ts. */
export function PriceTable() {
  return (
    <div className="overflow-x-auto rounded-md border border-[color:var(--hairline)]">
      <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
        <caption className="sr-only">Preise der privaten Karaoke-Räume pro Raum</caption>
        <thead>
          <tr>
            <th scope="col" className="meta px-5 py-4 font-normal">
              Raum
            </th>
            <th scope="col" className="meta px-5 py-4 font-normal">
              Kapazität
            </th>
            {priceColumns.map((column) => (
              <th key={column} scope="col" className="meta px-5 py-4 font-normal">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {karaokeRooms.map((room) => (
            <tr key={room.slug} className="border-t border-[color:var(--hairline)]">
              <th scope="row" className="px-5 py-4 font-normal text-bone">
                {room.name}
                <span className="mt-1 block text-xs text-[color:var(--text-faint)]">{room.type}</span>
              </th>
              <td className="px-5 py-4 text-[color:var(--text-dim)]">{room.capacityLabel}</td>
              {room.pricing.map((price, i) => (
                <td key={i} className="px-5 py-4 tabular-nums text-bone">
                  {price.toLocaleString("de-AT", { style: "currency", currency: "EUR", minimumFractionDigits: 0 })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
