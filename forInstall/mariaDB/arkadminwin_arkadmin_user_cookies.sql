create table arkadmin_user_cookies
(
    id       int unsigned zerofill auto_increment
        primary key,
    md5id    text null,
    validate text null,
    userid   int  null
);