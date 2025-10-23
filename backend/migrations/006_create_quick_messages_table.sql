-- Create quick messages table for SMS-based transaction entry
CREATE TABLE IF NOT EXISTS quick_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processed', 'failed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_quick_messages_user_id ON quick_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_messages_status ON quick_messages(status);
