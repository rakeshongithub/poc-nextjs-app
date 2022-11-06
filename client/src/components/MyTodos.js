import React from 'react';
import Link from 'next/link';

export default function MyTodos({ todosData, locale }) {
  return (
    <div>
      <h1>My Todos - {locale}</h1>
      <section>
        {todosData?.map((item) => {
          return (
            <div
              key={item.id}
              className="todos-items">
              {/* <Link href={`/todos/${item.id}`}> */}
              <Link
                href={{
                  pathname: `/todos/${item.id}`
                }}>
                <a>{item.title}</a>
              </Link>
            </div>
          );
        })}
      </section>
    </div>
  );
}
