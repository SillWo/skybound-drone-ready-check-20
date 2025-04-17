
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
        location: 'На базе',
        items: [
          { id: uuidv4(), label: 'Зарядить батареи', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Подготовить и загрузить подложки для местности полетов на НСУ', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Загрузить карту высот на НСУ', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Подготовить маршрут', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Произвести сбор оборудования по списку', hasHelp: false, checked: false }
        ]
      },
      {
        id: uuidv4(),
        title: 'Подготовка на месте',
        location: 'На месте',
        items: [
          { id: uuidv4(), label: 'Оценить погодные условия', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Произвести сборку БЛА', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Развернуть НСУ', hasHelp: true, checked: false }
        ]
      },
      {
        id: uuidv4(),
        title: 'Предполетная проверка',
        location: 'Перед взлетом',
        items: [
          { id: uuidv4(), label: 'Подать электропитание питание на БЛА', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Проверить наличие связи с НСУ', hasHelp: true, checked: false },
          { id: uuidv4(), label: 'Пройти предполетные проверки', hasHelp: false, checked: false },
          { id: uuidv4(), label: 'Сделать контрольное фото', hasHelp: true, checked: false }
        ]
      }
    ],
    totalProgress: 0
  };
};
