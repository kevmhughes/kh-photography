export default {
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'text',
    },
    {name: 'description', title: 'Description', type: 'string'},
    {
      name: 'exif_data',
      title: 'EXIF Data',
      type: 'object',
      options: {collapsible: true},
      fields: [
        // optionally define common EXIF fields like ISO, aperture, etc.
        {name: 'camera', type: 'string', title: 'Camera'},
        {name: 'lens', type: 'string', title: 'Lens'},
        {name: 'aperture', type: 'string', title: 'Aperture'},
        {name: 'iso', type: 'number', title: 'ISO'},
        {name: 'focalLength', type: 'string', title: 'Focal Length'},
        {name: 'shutterSpeed', type: 'string', title: 'Shutter Speed'},
      ],
    },
    {
      name: 'image',
      title: 'Full Image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'albums',
      title: 'Albums',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'album'}]}],
    },
  ],
}
