import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { ResourceItem } from '../models/ResourceItem';
import { User } from '../models/User';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const addDummyResources = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capacity_connect');
    console.log('Connected to DB');

    // Find a trainer to use as uploader
    const trainer = await User.findOne({ role: 'trainer' });
    if (!trainer) {
      console.log('No trainer found, please run seed.ts first');
      process.exit(1);
    }

    console.log(`Using trainer: ${trainer.name} (${trainer._id})`);

    // Create 3 dummy resources
    const dummyResources = [
      {
        uploaderId: trainer._id,
        title: 'Weather Radar Calibration Script',
        type: 'script',
        category: 'Scripts',
        fileSize: '12 KB',
        content: `#!/bin/bash
# DWR Calibration Check Script
# Validates radar reflectivity (Z) against ground truth
echo "Starting calibration sequence..."
./calibrate_dwr --scan-mode VCP21
if [ $? -eq 0 ]; then
  echo "Calibration successful."
else
  echo "Calibration failed. Check log for details."
fi`,
      },
      {
        uploaderId: trainer._id,
        title: 'Standard Operating Procedure (SOP) for Severe Weather',
        type: 'text',
        category: 'Manuals',
        fileSize: '45 KB',
        content: `Standard Operating Procedure: Severe Weather Events
        
1. Monitor radar echoes for DBZ > 55.
2. If hook echo detected, immediately issue flash flood/severe storm warning.
3. Coordinate with local emergency responders.
4. Log all observations in the central database every 15 minutes.
5. De-escalate only after storm cells move out of the 100km radius.`,
      },
      {
        uploaderId: trainer._id,
        title: 'Data Processing Python Snippet',
        type: 'code',
        category: 'Code Scripts',
        fileSize: '2 KB',
        content: `import netCDF4 as nc
import numpy as np

def process_nc_file(filepath):
    dataset = nc.Dataset(filepath)
    temp_var = dataset.variables['temperature']
    print(f"Max Temp: {np.max(temp_var)}")
    print(f"Min Temp: {np.min(temp_var)}")
    dataset.close()

if __name__ == '__main__':
    process_nc_file('./sample_data.nc')`,
      }
    ];

    await ResourceItem.insertMany(dummyResources);
    console.log('Successfully inserted dummy resources!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding dummy resources:', error);
    process.exit(1);
  }
};

addDummyResources();
