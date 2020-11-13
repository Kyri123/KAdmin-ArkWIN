create table arkadmin_reg_code
(
    id   int unsigned zerofill auto_increment
        primary key,
    code text null,
    used int  null,
    rang int  null
);