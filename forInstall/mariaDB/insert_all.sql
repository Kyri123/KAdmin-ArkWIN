create table arkadmin_user_group
(
    id          int auto_increment
        primary key,
    name        text     null,
    editform    int      null,
    time        bigint   null,
    permissions longtext null,
    canadd      longtext null
);
INSERT INTO arkadmin_user_group (id, name, editform, time, permissions, canadd) VALUES (1, 'Superadmin', 1, 1603693072, '{"all":{"is_admin":1}}', '[1]');
create table arkadmin_user_cookies
(
    id       int unsigned zerofill auto_increment
        primary key,
    md5id    text null,
    validate text null,
    userid   int  null
);
create table arkadmin_users
(
    id           int unsigned zerofill auto_increment
        primary key,
    username     text          null,
    email        text          null,
    password     text          null,
    lastlogin    double        null,
    registerdate double        null,
    rang         text          null,
    ban          int default 0 null
);
create table arkadmin_reg_code
(
    id   int unsigned zerofill auto_increment
        primary key,
    code text null,
    used int  null,
    rang int  null
);
INSERT INTO arkadmin_users (id, username, email, password, lastlogin, registerdate, rang, ban) VALUES (1, 'Gast', 'none', 'a', 0, 0, '[0]', 0);
INSERT INTO arkadmin_users (id, username, email, password, lastlogin, registerdate, rang, ban) VALUES (2, 'admin', 'system@node.js', '21232f297a57a5a743894a0e4a801fc3', 0, 0, '[1]', 0);