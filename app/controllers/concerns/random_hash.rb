module RandomHash
  private
  def random_hash
    ('a'..'z').to_a.shuffle.join
  end
end