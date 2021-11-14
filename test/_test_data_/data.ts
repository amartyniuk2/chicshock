const testUsers: any[] = [
  {
    id: 'ckudjdcua0000f6162ezr7ydg',
    email: 'nandi@simpson.com',
    firstName: 'Lisa',
    lastName: 'Simpson',
    password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
    role: 'USER',
    userType: 'normal',
    emailVerified: false,
    status: 'active',
    signupType: 'username/email/password',
    username: 'patainsns',
  },
  {
    id: 'ckudjdcua0000f6162ezr8ydg',
    email: 'chobe@simpson.com',
    firstName: 'Lisa',
    lastName: 'Simpson',
    password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
    role: 'USER',
    userType: 'normal',
    emailVerified: false,
    status: 'active',
    signupType: 'username/email/password',
    username: 'katainsns',
  },
  {
    id: 'ckudjdcua0000f6162ezr9ydg',
    email: 'kilsa@simpson.com',
    firstName: 'Lisa',
    lastName: 'Simpson',
    password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
    role: 'USER',
    userType: 'normal',
    emailVerified: false,
    status: 'active',
    signupType: 'username/email/password',
    username: 'matainsns',
  },
  {
    id: 'ckudjdcua0000f6162ezr6ydg',
    email: 'kelsa@simpson.com',
    firstName: 'Lisa',
    lastName: 'Simpson',
    password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
    role: 'USER',
    userType: 'normal',
    emailVerified: false,
    status: 'active',
    signupType: 'username/email/password',
    username: 'satainns',
  },
];

const testPosts: any[] = [
  {
    id: 'ckui5ks6v0066ut16orgymdch',
    photos: ['nandi@simpson.com'],
    title: 'Lisa',
    userId: 'ckudjdcua0000f6162ezr9ydg',
    categoryId: 'ckui5ks6v0067ut16o5f7pxc6',
  },
  {
    id: 'ckui5ks6v0067ut16o3f7pxc6',
    photos: ['nandi@simpson.com'],
    title: 'Lisa',
    userId: 'ckudjdcua0000f6162ezr9ydg',
    categoryId: 'ckui5ks6v0066ut16orgyxdch',
  },
  {
    id: 'ckui5ks6v0068ut16ljdbq5xs',
    photos: ['nandi@simpson.com'],
    title: 'Lisa',
    userId: 'ckudjdcua0000f6162ezr9ydg',
    categoryId: 'ckui5ks6v0068ut16ljdbq9xs',
  },
];

const testCategories: any[] = [
  {
    id: 'ckui5ks6v0066ut16orgyxdch',
    name: 'Sports',
    userId: 'ckudjdcua0000f6162ezr9ydg',
  },
  {
    id: 'ckui5ks6v0067ut16o5f7pxc6',
    name: 'Cooking',
    userId: 'ckudjdcua0000f6162ezr9ydg',
  },
  {
    id: 'ckui5ks6v0068ut16ljdbq9xs',
    name: 'Fashion',
    userId: 'ckudjdcua0000f6162ezr9ydg',
  },
];

export { testUsers, testPosts, testCategories };
