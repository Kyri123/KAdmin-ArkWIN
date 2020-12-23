create table ArkAdmin_users
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

INSERT INTO admin_arkmanager.ArkAdmin_users (id, username, email, password, lastlogin, registerdate, rang, ban) VALUES (1, 'Gast', 'none', 'a', 0, 0, '[1]', 0);
INSERT INTO admin_arkmanager.ArkAdmin_users (id, username, email, password, lastlogin, registerdate, rang, ban) VALUES (24, 'Kyrium', 'olli143@live.de', 'e6bf99afbcf0379e6baf71d8ab0a551d', 1607588196, 1597909184, '[1]', 0);
INSERT INTO admin_arkmanager.ArkAdmin_users (id, username, email, password, lastlogin, registerdate, rang, ban) VALUES (25, 'Ahrazel', 'kevin.ahrens.95@web.de', '25f9e794323b453885f5181f1b624d0b', 1606348137, 1597933715, '["2"]', 0);