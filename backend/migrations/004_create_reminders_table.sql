-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  due_date TIMESTAMP NOT NULL,
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('monthly', 'weekly', 'daily', 'once')),
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_is_active ON reminders(is_active);
