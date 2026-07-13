import { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadToImgBB } from '../utils/imgbb';

export const ImageUploadField = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      onChange(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed. You can paste an image URL instead.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        {value && <img src={value} alt="Preview" className="h-14 w-14 rounded-lg object-cover" />}
        <div className="flex-1 space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
          />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>
      {uploading && <p className="mt-1 text-xs text-gray-400">Uploading…</p>}
    </div>
  );
};
