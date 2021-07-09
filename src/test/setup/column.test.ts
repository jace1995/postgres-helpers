// import { createTable } from '../../setup/table';
// import { assert } from 'chai';
// import { column, pk } from '../../setup/table/column';
// import { room, User, user } from '../mock';
// import { FkAction } from '../../setup/constraint';
// import { SetupHelpers } from '../../types';

// enum TestEnum {
//   first = 'first',
//   second = 'second',
// }

// describe.skip('column', () => {
//   it('default normal', () => {
//     assert.equal(
//       createTable<User>(user, {
//         id: pk(),
//         name: column('varchar'),
//         age: column({
//           type: 'integer',
//           check: `${user.age} > 0`,
//         }),
//         room_id: column({
//           type: 'bigint',
//           optional: true,
//           fk: {
//             tableJoin: room,
//             columns: {
//               [user.room_id()]: room.id()
//             },
//             onDelete: FkAction.setNull,
//           },
//         }),
//       })(new SetupHelpers()),
//       `create sequence "sequence__user";\n` +
//       `create table "user" (` +
//       `"id" bigint not null default nextval('sequence__user'), ` +
//       `"name" varchar not null, ` +
//       `"age" integer not null, ` +
//       `"room_id" bigint, ` +
//       `constraint "pk__user__id" primary key ("id"), ` +
//       `constraint "check__user__age" check ("age" > 0), ` +
//       `constraint "fk__user__room_id__room__id" ` +
//       `foreign key ("user"."room_id") references "room" ("room"."id") on delete set null` +
//       `);`
//     )
//   })
//   it('optional')
//   it('force')
// })
