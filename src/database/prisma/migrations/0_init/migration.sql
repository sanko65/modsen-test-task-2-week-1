
[+] Added enums
  - user_role

[+] Added tables
  - attendees
  - meetup
  - user

[*] Changed the `attendees` table
  [+] Added foreign key on columns (meetup_id)
  [+] Added foreign key on columns (user_id)

[*] Changed the `meetup` table
  [+] Added foreign key on columns (creator_id)

[*] Changed the `user` table
  [+] Added unique index on columns (email)

