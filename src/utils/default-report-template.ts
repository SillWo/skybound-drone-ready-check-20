
import { v4 as uuidv4 } from 'uuid';
import { Report } from '@/types/report';

export const createDefaultTemplate = (): Report => {
  return {
    id: uuidv4(),
    title: 'Стандартный отчет о предполетной подготовке',
    date: new Date().toISOString(),
    sections: [
      {
        id: uuidv4(),
        title: 'Предварительная подготовка',
        location: 'На базе / до полетов',
        items: [
          { id: uuidv4(), label: 'Зарядить батареи: Силовые АКБ х2', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Зарядить батареи: АКБ пульта РДУ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Зарядить батареи: АКБ НСУ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Подготовить и загрузить подложки для местности полетов на НСУ', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Загрузить карту высот на НСУ', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Подготовить маршрут', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Произвести сбор оборудования по списку', hasHelp: false, checked: false }
        ]
      },
      {
        id: uuidv4(),
        title: 'Предварительная подготовка',
        location: 'На месте',
        items: [
          { id: uuidv4(), label: 'Оценить погодные условия, отложить полет если: постоянный ветер более 10m/s', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Оценить погодные условия, отложить полет если: порывы ветра более 15m/s', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Оценить погодные условия, отложить полет если: направление ветра боковое относительно линии разгона', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Оценить погодные условия, отложить полет если: видимость не позволяет вести съемку', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Оценить погодные условия, отложить полет если: осадки', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Оценить погодные условия, отложить полет если: негативная динамика погоды', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Произвести сборку БЛА', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Установить фюзеляж в исходное положение', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить АКБ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить воздушный винт на маршевый двигатель, проверить затяжку', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить карбоновые трубку', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить и закрепить крылья', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить балки, зафиксировать крепежными винтами', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить хвостовое оперение, зафиксировать крепежным винтом', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить воздушные винты электродвигателей, проверить затяжку', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Развернуть НСУ', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Установить антенный пост: Установить штатив', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить антенный пост: Установить радиомодем на штатив', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Подключить антенный пост к ноутбуку НСУ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Подключить мышь к ноутбуку НСУ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Подключить НСУ к сети 220В', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Запустить ПО Эфир', hasHelp: false, checked: false }
        ]
      },
      {
        id: uuidv4(),
        title: 'Предполетная подготовка',
        location: 'Перед взлетом',
        items: [
          { id: uuidv4(), label: 'Подать электропитание питание на БЛА, дождаться загрузки автопилота', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Проверить наличие связи с НСУ, убедится в корректности телеметрии', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Пройти предполетные проверки: Сервоприводы', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Пройти предполетные проверки: Регуляторы', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Пройти предполетные проверки: БАНО', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Сделать контрольное фото (fphoto -e, fphoto -c 0)', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Пройти предполетные проверки: СВС', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Контролировать переход ЛА В режим "ГОТОВ", при необходимости повторить проверки', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Загрузить или создать миссию на НСУ, убедиться, что в миссии есть посадочная точка', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Передать миссию на БВС', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить текущий и следующий маршруты', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить высоту и направление точки посадки', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Установить высоту базовой точки', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Выполнить контрольный запрос миссии с БЛА', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Сориентировать БЛА против ветра', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Перевести пульт ДУ в исходное положение', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Включить пульт ДУ, убедиться в наличии управления через пульт', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Перевести пульт в автоматический режим', hasHelp: false, checked: false }
        ]
      },
      {
        id: uuidv4(),
        title: 'Взлет',
        location: 'Взлетная площадка',
        items: [
          { id: uuidv4(), label: 'Запустить видеофиксацию', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Опрос перед взлетом: чеклист подготовки выполнен', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Опрос перед взлетом: питание 220В наземной станции поступает (по индикатору БП)', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Опрос перед взлетом: батареи 50В', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Опрос перед взлетом: GNSS 12+', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Опрос перед взлетом: пилот готов, пульт в автоматическом режиме', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Опрос перед взлетом: оператор камеры готов', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Опрос перед взлетом: погода ОК', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Опрос перед взлетом: помехи взлету и посадке отсутствуют', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Разблокировать АРМ с НСУ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Заармить ЛА с пульта ДУ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Перевести ЛА в режим "Взлет"', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Контролировать набор высоты', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Контролировать набор скорости до 75 км/ч', hasHelp: false, checked: false }
        ]
      },
      {
        id: uuidv4(),
        title: 'Полет по Маршруту',
        location: 'Наблюдение',
        items: [
          { id: uuidv4(), label: 'Контролировать показатели скорости, высоты, крена и тангажа при прохождении ППМ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Контролировать увеличение счетчика снимков на участках АФС', hasHelp: false, checked: false }
        ]
      },
      {
        id: uuidv4(),
        title: 'Посадка',
        location: 'Посадочная площадка',
        items: [
          { id: uuidv4(), label: 'Контролировать заход на посадочную глиссаду', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Контролировать выключение маршевого двигателя за 200 метров до последнего ППМ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Контролировать заход на посадочную точку в коптерном режиме', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Контролировать снижение, при необходимости перехватить в ручной режим с пульта ДУ', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'После касания земли заблокировать двигатели с НСУ или пульта ДУ', hasHelp: false, checked: false }
        ]
      }
    ],
    totalProgress: 0
  };
};
