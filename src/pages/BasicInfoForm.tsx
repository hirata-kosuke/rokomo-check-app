import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

export default function BasicInfoForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    height: '',
    organization_type: '' as 'company' | 'medical' | '',
    organization_name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!formData.name || !formData.age || !formData.gender || !formData.height || !formData.organization_type) {
      alert('すべての必須項目を入力してください');
      return;
    }

    if (formData.organization_type && !formData.organization_name) {
      alert('企業名/医療機関名を入力してください');
      return;
    }

    if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      alert('年齢は1〜120の範囲で入力してください');
      return;
    }

    if (parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
      alert('身長は100〜250の範囲で入力してください');
      return;
    }

    // データを保存
    sessionStorage.setItem('basicInfo', JSON.stringify({
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      height: parseFloat(formData.height),
      organization_type: formData.organization_type,
      organization_name: formData.organization_name,
    }));

    navigate('/rokomo-check');
  };

  return (
    <div className="basic-info-form">
      <div className="container">
        <div className="form-header">
          <User size={48} className="icon" />
          <h1>基本情報の入力</h1>
          <p>ロコモチェックを始める前に、基本情報を入力してください。</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">氏名 *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="山田 太郎"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">年齢 *</label>
            <input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="65"
              min="1"
              max="120"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="height">身長（cm） *</label>
            <input
              id="height"
              type="number"
              step="0.1"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              placeholder="171"
              min="100"
              max="250"
              required
            />
          </div>

          <div className="form-group">
            <label>性別 *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' })}
                  required
                />
                <span>男性</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'female' })}
                  required
                />
                <span>女性</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>所属 *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="organization_type"
                  value="company"
                  checked={formData.organization_type === 'company'}
                  onChange={(e) => setFormData({ ...formData, organization_type: e.target.value as 'company' })}
                  required
                />
                <span>企業</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="organization_type"
                  value="medical"
                  checked={formData.organization_type === 'medical'}
                  onChange={(e) => setFormData({ ...formData, organization_type: e.target.value as 'medical' })}
                  required
                />
                <span>医療機関</span>
              </label>
            </div>
          </div>

          {formData.organization_type && (
            <div className="form-group">
              <label htmlFor="organization_name">
                {formData.organization_type === 'company' ? '企業名' : '医療機関名'} *
              </label>
              <input
                id="organization_name"
                type="text"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                placeholder={formData.organization_type === 'company' ? '株式会社〇〇' : '〇〇病院'}
                required
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              次へ進む
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
