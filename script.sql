create table qrdb;

use qrdb;

create table visitas (
  id int auto_increment primary key,
  codigo varchar(100),
  sala varchar(100),
  data DATETIME DEFAULT CURRENT_TIMESTAMP
);

insert into visitas (codigo, sala, data)
values (?, ?, ?);

select sala, COUNT(*) as total_visitas, COUNT(distinct sala) as salas_ativas
from visitas
group by sala
order by sala asc;

delete from visitas;

select * from visitas;