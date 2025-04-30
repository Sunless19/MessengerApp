db = db.getSiblingDB('admin'); 

db.createUser({
  user: "user", 
  pwd: "abc123", 
  roles: [
    { role: "readWrite", db: "messenger_app" } 
  ]
});

print("User created successfully!");
