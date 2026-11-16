import Link from "next/link";

export default function Pager(props: any) {
  let totalPg = Math.ceil(props.total / props.size);
  let items = [];
  const start = props.offset > 3 ? props.offset - 2 : 0;
  const end = props.offset + 4 >= totalPg ? totalPg : props.offset + 3;

  const setCurrentPage = (page: number) => {
    if (page >= 1 || page <= totalPg) {
      if (props.pagePath) {
        return `${props.pagePath}?p=${page}`;
      } else {
        return `?p=${page}`;
      }
    } else return "";
  };

  for (let i = start; i < end; i++) {
    items.push(
      <li
        key={i}
        className={i === props.offset ? "text-darkGray" : "text-orange"}
      >
        {i === props.offset ? (
          <span className="font-medium">{i + 1}</span>
        ) : (
          <Link href={setCurrentPage(i + 1)} className="font-medium">
            {i + 1}
          </Link>
        )}
      </li>
    );
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="flex gap-4 my-3">
        <li className={props.offset === 0 ? "text-darkGray" : "text-orange"}>
          {props.offset === 0 ? (
            <span className="font-medium">&laquo;</span>
          ) : (
            <Link href={setCurrentPage(1)} className="font-medium">
              &laquo;
            </Link>
          )}
        </li>
        <li className={props.offset === 0 ? "text-darkGray" : "text-orange"}>
          {props.offset === 0 ? (
            <span className="font-medium">‹</span>
          ) : (
            <Link href={setCurrentPage(props.offset)} className="font-medium">
              ‹
            </Link>
          )}
        </li>
        {props.offset > 3 && (
          <li className="text-orange">
            <Link href={setCurrentPage(1)} className="font-medium">
              1
            </Link>
          </li>
        )}
        {props.offset > 3 && (
          <li className="text-darkGray">
            <a className="font-medium">...</a>
          </li>
        )}
        {items}
        {props.offset < totalPg - 4 && (
          <li className="text-darkGray">
            <a className="font-medium">...</a>
          </li>
        )}
        {props.offset < totalPg - 4 && (
          <li className="text-orange">
            <Link className="font-medium" href={setCurrentPage(totalPg)}>
              {totalPg}
            </Link>
          </li>
        )}
        <li
          className={
            props.offset + 1 === totalPg ? "text-darkGray" : "text-orange"
          }
        >
          {props.offset + 1 === totalPg ? (
            <span className="font-medium">›</span>
          ) : (
            <Link
              href={setCurrentPage(props.offset + 2)}
              className="font-medium"
            >
              ›
            </Link>
          )}
        </li>
        <li
          className={
            props.offset + 1 === totalPg ? "text-darkGray" : "text-orange"
          }
        >
          {props.offset + 1 === totalPg ? (
            <span className="font-medium">&raquo;</span>
          ) : (
            <Link href={setCurrentPage(totalPg)} className="font-medium">
              &raquo;
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
