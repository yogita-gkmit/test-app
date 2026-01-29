import { dataSource } from '../../ormconfig';
import { Item } from '../items/items.entity';

async function seed() {
  try {
    console.log('Initializing Data Source...');
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    const itemRepository = dataSource.getRepository(Item);

    const itemsToCheck = [
      { name: 'Item 1', description: 'Description for Item 1' },
      { name: 'Item 2', description: 'Description for Item 2' },
      { name: 'Item 3', description: 'Description for Item 3' },
    ];

    for (const itemData of itemsToCheck) {
      const exists = await itemRepository.findOneBy({ name: itemData.name });
      if (!exists) {
        const newItem = itemRepository.create(itemData);
        await itemRepository.save(newItem);
        console.log(`Saved item: ${newItem.name}`);
      } else {
        console.log(`Item already exists: ${itemData.name}`);
      }
    }

    console.log('Seeding completed.');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

seed();
