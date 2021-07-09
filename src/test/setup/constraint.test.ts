// import { assert } from 'chai';
// import { room, user } from '../mock';
// import { ConstraintType,
//   constraintName,
//   constraintUnique,
//   constraintCheck,
//   constraintPrimaryKey,
//   constraintForeignKey,
//   FkAction,
// } from '../../setup/constraint'

// describe('constraint', () => {
//   it('name: "check" 1 key', () => {
//     assert.equal(
//       constraintName(ConstraintType.check, [user.name]),
//       `"check__name"`
//     )
//   })

//   it('name: "pk" 2 keys', () => {
//     assert.equal(
//       constraintName(ConstraintType.pk, [user.age, user.name]),
//       `"pk__age__name"`
//     )
//   })

//   it('unique: 1 key', () => {
//     assert.equal(
//       constraintUnique(user, [user.name]),
//       `constraint "unique__user__name" unique ("name")`
//     )
//   })

//   it('unique: 2 keys', () => {
//     assert.equal(
//       constraintUnique(user, [user.age, user.name]),
//       `constraint "unique__user__age__name" unique ("age", "name")`
//     )
//   })

//   it('check: 1 key', () => {
//     assert.equal(
//       constraintCheck(user, [user.age], `${user.age} > 5`),
//       `constraint "check__user__age" check ("age" > 5)`
//     )
//   })

//   it('check: 2 keys', () => {
//     assert.equal(
//       constraintCheck(user, [user.age, user.name], `${user.age} > 30 or ${user.name} = 'admin'`),
//       `constraint "check__user__age__name" check ("age" > 30 or "name" = 'admin')`
//     )
//   })

//   it('check: 1 key', () => {
//     assert.equal(
//       constraintCheck(user, [user.age], `${user.age} > 5`),
//       `constraint "check__user__age" check ("age" > 5)`
//     )
//   })

//   it('check: 2 keys', () => {
//     assert.equal(
//       constraintCheck(user, [user.age, user.name], `${user.age} > 30 or ${user.name} = 'admin'`),
//       `constraint "check__user__age__name" check ("age" > 30 or "name" = 'admin')`
//     )
//   })

//   it('pk: 1 key', () => {
//     assert.equal(
//       constraintPrimaryKey(user, [user.age]),
//       `constraint "pk__user__age" primary key ("age")`
//     )
//   })

//   it('pk: 2 keys', () => {
//     assert.equal(
//       constraintPrimaryKey(user, [user.age, user.name]),
//       `constraint "pk__user__age__name" primary key ("age", "name")`
//     )
//   })

//   it('fk: 1 key', () => {
//     assert.equal(
//       constraintForeignKey({
//         tableJoin: room,
//         columns: {
//           [user.room_id()]: room.id()
//         }
//       }),
//       `constraint "fk__user__room_id__room__id" ` +
//       `foreign key ("user"."room_id") references "room" ("room"."id")`
//     )
//   })

//   it('fk: 2 keys', () => {
//     assert.equal(
//       constraintForeignKey({
//         tableJoin: room,
//         columns: {
//           [user.room_id()]: room.id(),
//           [user.name()]: room.name(),
//         }
//       }),
//       `constraint "fk__user__room_id__room__id__user__name__room__name" ` +
//       `foreign key ("user"."room_id", "user"."name") references "room" ("room"."id", "room"."name")`
//     )
//   })

//   it('fk: on update', () => {
//     assert.equal(
//       constraintForeignKey({
//         tableJoin: room,
//         columns: {
//           [user.room_id()]: room.id()
//         }
//       }),
//       `constraint "fk__user__room_id__room__id" ` +
//       `foreign key ("user"."room_id") references "room" ("room"."id")`
//     )
//   })

//   it('fk: on delete cascade', () => {
//     assert.equal(
//       constraintForeignKey({
//         tableJoin: room,
//         columns: {
//           [user.room_id()]: room.id()
//         },
//         onDelete: FkAction.cascade
//       }),
//       `constraint "fk__user__room_id__room__id" foreign key ("user"."room_id") ` +
//       `references "room" ("room"."id") on delete cascade`
//     )
//   })
// })
