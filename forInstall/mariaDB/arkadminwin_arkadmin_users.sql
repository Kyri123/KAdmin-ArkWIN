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

INSERT INTO arkadmin_users (id, username, email, password, lastlogin, registerdate, rang, ban) VALUES (1, 'Gast', 'none', 'a', 0, 0, '[0]', 0);
INSERT INTO arkadmin_users (id, username, email, password, lastlogin, registerdate, rang, ban) VALUES (2, 'admin', 'system@node.js', '21232f297a57a5a743894a0e4a801fc3', 0, 0, '[1]', 0);