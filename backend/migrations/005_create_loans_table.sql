-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  person_name VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  type VARCHAR(20) NOT NULL CHECK (type IN ('given', 'received')),
  date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid')),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_type ON loans(type);
